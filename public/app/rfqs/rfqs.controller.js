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
        .controller('RFQsController', RFQsController);

    RFQsController.$inject = ['RfqsTableService', 'RfqService', 'QuotesTableService', 'QuotesService', '$scope'];

    function RFQsController(RfqsTableService, RfqService, QuotesTableService, QuotesService, $scope) {
        var vm = this;

        /**
         * Top table
         */
        var now = moment();

        vm.rfqsTable = { options: {} };

        vm.rfqsTable.options = RfqsTableService.options();

        var onWebSocketMessage = function(evt) {
            var rfqObject = RfqService.parseRfq(evt.data);

            setUpTimeout(rfqObject);

            rfqObject.dealers = prettifyList(rfqObject.dealers);
            rfqObject.creditEvents = prettifyList(rfqObject.creditEvents);

            if (vm.rfqsTable.options.data) {
                vm.rfqsTable.options.data.push(rfqObject);
            }
            else {
                vm.rfqsTable.options.data = [rfqObject];
            }

            function prettifyList(uglyList) {
                var prettyRes = "";
                uglyList.map(function (dealer) {
                    prettyRes += dealer + ', ';
                });

                return prettyRes.substr(0, prettyRes.length - 2);
            }
        };

        setInterval(function() {
            vm.gridApi.core.refresh();
        }, 1000);

        RfqService.streamRfq( onWebSocketMessage );

        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }

        /**
         * Bottom table
         */

        vm.quotesTable = { options: {} };

        var quotesByRfqId;

        QuotesService.getQuotesByClient().success(function(data) {
            $.map(data, function(v, k) {
                data[k] = v.map(function(quote) {
                    quote = setUpTimeout(quote);
                    return QuotesService.setProperId(quote);
                });
            });
            quotesByRfqId = data;
        });

        vm.quotesTable.options = QuotesTableService.options();

        vm.rfqsTable.options.onRegisterApi = function(gridApi) {
            vm.gridApi = gridApi;

            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                vm.quotesTable.options.data = quotesByRfqId[row.entity.id];
            });
        };

        var orderSuccess = function() {
            SweetAlert.swal(
                "Done !",
                "Quote aceepted !",
                "success"
            );
        };

        var orderError = function() {
            SweetAlert.swal(
                "Oops...",
                "Something went wrong !",
                "error"
            );
        };

        vm.accept = function(id) {
            QuotesService.accept(id, orderSuccess, orderError);
        };

        vm.isExpired = function(timeout) {
            return !isNumeric(timeout) || timeout <= 0;
        };

        function setUpTimeout(object) {
            var deadline = moment(object.timestamp * 1).add(object.timeWindowInMinutes, 'minutes');
            var diff = deadline.diff(now);
            var duration = Math.round(moment.duration(diff).asSeconds());
            var counter = setInterval(function () {
                if (duration > 0) {
                    duration = duration - 1;
                    object.timeout = duration;
                }
                else {
                    object.timeout = "Expired";
                    clearInterval(counter);
                }
            }, 1000);

            return object;
        }
    }
})();