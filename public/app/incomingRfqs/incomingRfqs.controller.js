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

    IncomingRfqsController.$inject = ['RfqService', 'RfqsTableForDealerService', 'QuoteModalService', '$scope', 'AuthenticationService', 'QuotesByRfqTableService', 'QuotesService', '$timeout', 'FormUtilsService', 'TimeoutManagerService', 'WebSocketsManager', 'GridTableUtil', '$filter'];

    function IncomingRfqsController(RfqService, RfqsTableForDealerService, QuoteModalService, $scope, AuthenticationService, QuotesByRfqTableService, QuotesService, $timeout, FormUtilsService, TimeoutManagerService, WebSocketsManager, GridTableUtil, $filter) {
        var vm = this;

        var currentAccount = AuthenticationService.getCurrentAccount();

        var selectedRfq;

        vm.originalData = { rfqs: [], quotes: [] };

        /**
         * Top table
         */

        var rfqsCallbackName = 'incomingRfqsTable';
        var quoteCallbackName = 'incomingQuotesTable';

        vm.rfqTable = {};
        vm.rfqTable.options = RfqsTableForDealerService.options();

        WebSocketsManager.webSockets.rfq.dealer.addCallback(rfqsCallbackName, function(rfqObject) {
            rfqObject = TimeoutManagerService.setUpTimeout(rfqObject, $scope);
            rfqObject.timestampStr = $filter('date')(rfqObject.timestamp, 'HH:mm:ss');

            vm.originalData.rfqs.push(rfqObject);
            vm.rfqTable.filters.filterRfqs();
        });

        RfqService.getRfqForDealer(currentAccount).success(function(data) {
            vm.rfqTable.options.data = data.map(function(rfqObj) {
                var rfq = TimeoutManagerService.setUpTimeout(rfqObj, $scope);
                rfq.timestampStr = $filter('date')(rfqObj.timestamp, 'HH:mm:ss');

                return rfq;
            });

            vm.originalData.rfqs = vm.rfqTable.options.data;

            $timeout(function() {
                selectFirstRow();
            });
        });

        vm.isExpired = FormUtilsService.isExpired;

        vm.quote = QuoteModalService.quoteModal;

        $scope.$on('$destroy', function() {
            WebSocketsManager.webSockets.rfq.dealer.removeCallback(rfqsCallbackName);
            WebSocketsManager.webSockets.quotes.dealer.removeCallback(quoteCallbackName);
        });

        vm.rfqTable.filters = {};
        vm.rfqTable.filters.filterRfqs = function () {
            vm.rfqTable.options.data = vm.originalData.rfqs.filter(function (rfqObj) {
                var passFilter = vm.rfqTable.filters.timestampStr.filterFn(rfqObj) &&
                    vm.rfqTable.filters.referenceEntities.filterFn(rfqObj) &&
                    vm.rfqTable.filters.client.filterFn(rfqObj) &&
                    vm.rfqTable.filters.durationInMonths.start.filterFn(rfqObj) &&
                    vm.rfqTable.filters.durationInMonths.end.filterFn(rfqObj) &&
                    vm.rfqTable.filters.creditEvents.filterFn(rfqObj) &&
                    vm.rfqTable.filters.timeout.start.filterFn(rfqObj) &&
                    vm.rfqTable.filters.timeout.end.filterFn(rfqObj) &&
                    vm.rfqTable.filters.cdsValue.start.filterFn(rfqObj) &&
                    vm.rfqTable.filters.cdsValue.end.filterFn(rfqObj);

                if (rfqObj.id === selectedRfq.id) {
                    if (!passFilter) {
                        vm.quotesTable.options.data = [];
                    }
                }

                return passFilter;
            });
        };

        vm.rfqTable.filters.timestampStr = GridTableUtil.textFilterFactory(vm.rfqTable.filters.filterRfqs, 'timestampStr');
        vm.rfqTable.filters.referenceEntities = GridTableUtil.listFilterFactory(vm.rfqTable.filters.filterRfqs, 'referenceEntities');
        vm.rfqTable.filters.client = GridTableUtil.textFilterFactory(vm.rfqTable.filters.filterRfqs, 'client');
        vm.rfqTable.filters.durationInMonths = GridTableUtil.doubleNumberFilterFactory(vm.rfqTable.filters.filterRfqs, 'durationInMonths');
        vm.rfqTable.filters.creditEvents = GridTableUtil.listFilterFactory(vm.rfqTable.filters.filterRfqs, 'creditEvents');
        vm.rfqTable.filters.timeout = GridTableUtil.doubleNumberFilterFactory(vm.rfqTable.filters.filterRfqs, 'timeout');
        vm.rfqTable.filters.cdsValue = GridTableUtil.doubleNumberFilterFactory(vm.rfqTable.filters.filterRfqs, 'cdsValue');

        setInterval(function() {
            if (vm.rfqTable.filters.timeout.start.value.length || vm.rfqTable.filters.timeout.end.value.length) {
                vm.rfqTable.options.data = vm.rfqTable.options.data.filter(function(rfqObj) {
                    return vm.rfqTable.filters.timeout.start.filterFn(rfqObj) &&
                        vm.rfqTable.filters.timeout.end.filterFn(rfqObj);
                });
            }
        }, 1000);

        /**
         * Bottom table
         */

        vm.quotesTable = {};

        var quotesByRfqId = {};

        QuotesService.getQuotesByDealerGroupByRfqId(currentAccount).success(function(data) {
            $.map(data, function(v, k) {
                quotesByRfqId[k] = v.map(function(quoteObj) {
                    var quote = $.extend(true,{},quoteObj);
                    quote = prepareQuote(quote);

                    return quote;
                });
            });
        });

        WebSocketsManager.webSockets.quotes.dealer.addCallback(quoteCallbackName, function(quoteObj) {
            quoteObj = prepareQuote(quoteObj);

            if (quotesByRfqId[quoteObj.rfqId]) {
                quotesByRfqId[quoteObj.rfqId].push(quoteObj);
            } else {
                quotesByRfqId[quoteObj.rfqId] = [quoteObj];
            }
            updateQuoteTable(selectedRfq);
        });

        vm.quotesTable.options = QuotesByRfqTableService.options();

        vm.rfqTable.options.onRegisterApi = function(gridApi) {
            vm.rfqTable.gridApi = gridApi;

            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                selectedRfq = row.entity;
                updateQuoteTable(row.entity);
            });
        };

        vm.quotesTable.filters = {};

        vm.quotesTable.filters.filterQuotes = function () {
            vm.quotesTable.options.data = vm.originalData.quotes.filter(function (quoteObj) {
                return vm.quotesTable.filters.id.filterFn(quoteObj) &&
                    vm.quotesTable.filters.referenceEntities.filterFn(quoteObj) &&
                    vm.quotesTable.filters.client.filterFn(quoteObj) &&
                    vm.quotesTable.filters.timestampStr.filterFn(quoteObj) &&
                    vm.quotesTable.filters.premium.start.filterFn(quoteObj) &&
                    vm.quotesTable.filters.premium.end.filterFn(quoteObj) &&
                    vm.quotesTable.filters.timeout.start.filterFn(quoteObj) &&
                    vm.quotesTable.filters.timeout.end.filterFn(quoteObj);
            });
        };

        vm.quotesTable.filters.id = GridTableUtil.textFilterFactory(vm.quotesTable.filters.filterQuotes, 'id');

        vm.quotesTable.filters.referenceEntities = GridTableUtil.listFilterFactory(vm.quotesTable.filters.filterQuotes, 'referenceEntities');
        vm.quotesTable.filters.client = GridTableUtil.textFilterFactory(vm.quotesTable.filters.filterQuotes, 'client');
        vm.quotesTable.filters.timestampStr = GridTableUtil.textFilterFactory(vm.quotesTable.filters.filterQuotes, 'timestampStr');
        vm.quotesTable.filters.premium = GridTableUtil.doubleNumberFilterFactory(vm.quotesTable.filters.filterQuotes, 'premium');
        vm.quotesTable.filters.timeout = GridTableUtil.doubleNumberFilterFactory(vm.quotesTable.filters.filterQuotes, 'timeout');

        vm.cancelQuote = function(quote) {
            QuotesService.setStateCancelled(quote.id).success(function() {
                quote.state = QuotesService.states.cancelled;
            });
        };

        setInterval(function() {
            if (vm.quotesTable.filters.timeout.start.value.length || vm.quotesTable.filters.timeout.end.value.length) {
                vm.quotesTable.options.data = vm.quotesTable.options.data.filter(function(quoteObj) {
                    return vm.quotesTable.filters.timeout.start.filterFn(quoteObj) &&
                        vm.quotesTable.filters.timeout.end.filterFn(quoteObj);
                });
            }
        }, 1000);

        setInterval(function() {
            vm.rfqTable.gridApi.core.refresh();
        }, 1000);

        function prepareQuote(quoteObj) {
            quoteObj = TimeoutManagerService.setUpTimeout(quoteObj, $scope);
            quoteObj.timestampStr = $filter('date')(quoteObj.timestamp, 'HH:mm:ss');
            return quoteObj;
        }

        function updateQuoteTable(currentRfq) {
            var relatedQuotes = quotesByRfqId[currentRfq.id];

            if (relatedQuotes) {
                vm.quotesTable.options.data = relatedQuotes;
                vm.originalData.quotes = relatedQuotes;
                vm.quotesTable.filters.filterQuotes();
            }
            else {
                vm.quotesTable.options.data = [];
            }
        }

        function selectFirstRow() {
            if (vm.rfqTable.gridApi.selection.selectRow) {
                vm.rfqTable.gridApi.selection.selectRow(vm.rfqTable.options.data[vm.rfqTable.options.data.length - 1]);
            }
        }
    }
})();