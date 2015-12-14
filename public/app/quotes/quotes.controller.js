/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

/**
* @author : julienderay
* Created on 11/12/2015
*/

(function(){
    'use strict';

    angular
        .module('app')
        .controller('QuotesController', QuotesController);

    QuotesController.$inject = ['RfqService', 'RfqsTableForDealerService', 'QuoteModalService', '$scope'];

    function QuotesController(RfqService, RfqsTableForDealerService, QuoteModalService, $scope) {
        var vm = this;

        var now = moment();
        // todo : rename quotesTAble -> rfqsTable
        vm.rfqTable = {};
        vm.rfqTable.options = RfqsTableForDealerService.options(function( gridApi ) {
            vm.gridApi = gridApi;
        });

        var onWebSocketMessage = function(evt) {
            var rfqObject = RfqService.parseRfq(evt.data);
            console.log(rfqObject);
            setUpTimeout(rfqObject);
            rfqObject.prettyDealers = prettifyList(rfqObject.dealers);
            rfqObject.prettyCreditEvents = prettifyList(rfqObject.creditEvents);

            if (vm.rfqTable.options.data) {
                vm.rfqTable.options.data.push(rfqObject);
            }
            else {
                vm.rfqTable.options.data = [rfqObject];
            }
        };

        RfqService.getRfqForDealer().success(function(data) {
            vm.rfqTable.options.data = data.map(function(rfqObj) {
                var rfq = Object.create(rfqObj);

                setUpTimeout(rfq);

                rfq.prettyDealers = prettifyList(rfq.dealers);
                rfq.prettyCreditEvents = prettifyList(rfq.creditEvents);

                return rfq;
            });
        });

        function setUpTimeout(rfqObject) {
            var deadline = moment(rfqObject.timestamp).add(rfqObject.timeWindowInMinutes, 'minutes');
            var diff = deadline.diff(now);
            var duration = Math.round(moment.duration(diff).asSeconds());
            var counter = setInterval(function () {
                if (duration > 0) {
                    duration = duration - 1;
                    rfqObject.timeout = duration;
                }
                else {
                    rfqObject.timeout = "Expired";
                    clearInterval(counter);
                }
            }, 1000);
        }

        function prettifyList(uglyList) {
            var prettyRes = "";
            uglyList.map(function (dealer) {
                prettyRes += dealer + ', ';
            });

            return prettyRes.substr(0, prettyRes.length - 2);
        }

        vm.isExpired = function(timeout) {
            return !isNumeric(timeout) || timeout <= 0;
        };

        setInterval(function() {
            vm.gridApi.core.refresh();
        }, 1000);

        RfqService.streamRfqForDealer( onWebSocketMessage );

        vm.quote = QuoteModalService.quoteModal;

        $scope.$on('$destroy', function() {
            RfqService.closeRfqStream();
        });

        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }
    }
})();