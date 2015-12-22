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
        .controller('IncomingRfqsController', IncomingRfqsController);

    IncomingRfqsController.$inject = ['RfqService', 'RfqsTableForDealerService', 'QuoteModalService', '$scope', 'AuthenticationService', 'QuotesByRfqTableService', 'QuotesService', '$timeout'];

    function IncomingRfqsController(RfqService, RfqsTableForDealerService, QuoteModalService, $scope, AuthenticationService, QuotesByRfqTableService, QuotesService, $timeout) {
        var vm = this;

        var now = moment();
        var currentAccount = AuthenticationService.getCurrentAccount();

        var selectedRfq;

        /**
         * Top table
         */

        var rfqsCallbackName = 'incomingRfqsTable';
        var quoteCallbackName = 'incomingQuotesTable';

        vm.rfqTable = {};
        vm.rfqTable.options = RfqsTableForDealerService.options();

        var onWebSocketMessage = function(rfqObject) {
            rfqObject = setUpTimeout(rfqObject);

            if (vm.rfqTable.options.data) {
                vm.rfqTable.options.data.push(rfqObject);
            }
            else {
                vm.rfqTable.options.data = [rfqObject];
            }
        };

        RfqService.dealerWs.addCallback(rfqsCallbackName, onWebSocketMessage);

        RfqService.getRfqForDealer(currentAccount).success(function(data) {
            vm.rfqTable.options.data = data.map(function(rfqObj) {
                var rfq = setUpTimeout(rfqObj);
                rfq.prettyCreditEvents = RfqService.prettifyList(rfq.creditEvents);

                return rfq;
            });

            $timeout(function() {
                if (vm.rfqTable.gridApi.selection.selectRow) {
                    vm.rfqTable.gridApi.selection.selectRow(vm.rfqTable.options.data[vm.rfqTable.options.data.length - 1]);
                }
            });
        });

        vm.isExpired = function(timeout) {
            return !isNumeric(timeout) || timeout <= 0;
        };

        vm.quote = QuoteModalService.quoteModal;

        $scope.$on('$destroy', function() {
            RfqService.dealerWs.removeCallback(rfqsCallbackName);
        });

        /**
         * Bottom table
         */

        vm.quotesTable = {};

        var quotesByRfqId = {};

        QuotesService.getQuotesByDealerGroupByRfqId(currentAccount).success(function(data) {
            $.map(data, function(v, k) {
                quotesByRfqId[k] = v.map(function(quoteObj) {
                    var quote = $.extend(true,{},quoteObj);
                    quote = setUpTimeout(quote);

                    return quote;
                });
            });
        });

        var onNewQuote = function(quoteObj) {
            quoteObj = setUpTimeout(quoteObj);

            if (quotesByRfqId[quoteObj.rfqId]) {
                quotesByRfqId[quoteObj.rfqId].push(quoteObj);
            } else {
                quotesByRfqId[quoteObj.rfqId] = [quoteObj];
            }
            updateQuoteTable(selectedRfq);
        };

        QuotesService.dealerWs.addCallback(quoteCallbackName, onNewQuote);

        vm.quotesTable.options = QuotesByRfqTableService.options();

        vm.rfqTable.options.onRegisterApi = function(gridApi) {
            vm.rfqTable.gridApi = gridApi;

            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                selectedRfq = row.entity;
                updateQuoteTable(row.entity);
            });
        };

        setInterval(function() {
            vm.rfqTable.gridApi.core.refresh();
        }, 1000);

        function updateQuoteTable(currentRfq) {
            var relatedQuotes = quotesByRfqId[currentRfq.id];

            if (relatedQuotes) {
                vm.quotesTable.options.data = relatedQuotes;
            }
            else {
                vm.quotesTable.options.data = [];
            }
        }

        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }

        function setUpTimeout(object) {
            var newObj = $.extend({},object);
            var deadline = moment(object.timestamp).add(object.timeWindowInMinutes, 'minutes');
            var diff = deadline.diff(now);
            var duration = Math.round(moment.duration(diff).asSeconds());
            var counter = setInterval(function () {
                if (duration > 0) {
                    duration = duration - 1;
                    newObj.timeout = duration;
                }
                else {
                    newObj.timeout = "Expired";
                    clearInterval(counter);
                }
            }, 1000);

            return newObj;
        }
    }
})();