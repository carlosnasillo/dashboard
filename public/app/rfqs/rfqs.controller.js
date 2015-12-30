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

    RFQsController.$inject = ['RfqsTableService', 'RfqService', 'QuotesTableService', 'QuotesService', '$scope', 'TradeService', 'AlertsService', '$timeout', 'AuthenticationService', 'FormUtilsService', 'TimeoutManagerService', 'WebSocketsManager', 'ParseUtilsService', 'GridTableUtil', '$filter'];

    function RFQsController(RfqsTableService, RfqService, QuotesTableService, QuotesService, $scope, TradeService, AlertsService, $timeout, AuthenticationService, FormUtilsService, TimeoutManagerService, WebSocketsManager, ParseUtilsService, GridTableUtil, $filter) {
        var vm = this;

        var quotesByRfqId = {};

        var currentAccount = AuthenticationService.getCurrentAccount();

        vm.originalData = { rfqs: [], quotes: [] };

        /**
         * Top table
         */
        vm.rfqsTable = { options: {} };
        vm.rfqsTable.loading = true;

        vm.rfqsTable.options = RfqsTableService.options();
        var rfqCallbackName = 'clientRfqTable';

        WebSocketsManager.webSockets.rfq.client.addCallback(rfqCallbackName, function(rfqObject) {
            console.log(rfqObject);
            vm.rfqsTable.loading = false;

            rfqObject.expired = false;

            rfqObject = TimeoutManagerService.setUpTimeout(rfqObject);

            if (vm.rfqsTable.options.data) {
                vm.rfqsTable.options.data.push(rfqObject);
            }
            else {
                vm.rfqsTable.options.data = [rfqObject];
            }

            quotesByRfqId[rfqObject.id] = [];
        });

        RfqService.getRfqForClient(currentAccount).success(function(data) {
            vm.rfqsTable.loading = false;
            vm.rfqsTable.options.data = data.map(function(rfqObj) {
                var rfq = $.extend(true,{},rfqObj);

                rfq.prettyDealers = ParseUtilsService.prettifyList(rfq.dealers);
                rfq.prettyCreditEvents = ParseUtilsService.prettifyList(rfq.creditEvents);
                rfq.expired = false;
                rfq.timestampStr = $filter('date')(rfqObj.timestamp, 'HH:mm:ss');
                rfq = TimeoutManagerService.setUpTimeout(rfq);

                return rfq;
            });

            vm.originalData.rfqs = vm.rfqsTable.options.data;

            $timeout(function() {
                if (vm.rfqsTable.gridApi.selection.selectRow) {
                    vm.rfqsTable.gridApi.selection.selectRow(vm.rfqsTable.options.data[vm.rfqsTable.options.data.length - 1]);
                }
            });
        });

        vm.rfqsTable.filters = {};
        vm.rfqsTable.filters.filterRfqs = function () {
            vm.rfqsTable.options.data = vm.originalData.rfqs.filter(function (rfqObj) {
                return vm.rfqsTable.filters.referenceEntity.filterFn(rfqObj) &&
                vm.rfqsTable.filters.timestampStr.filterFn(rfqObj) &&
                vm.rfqsTable.filters.id.filterFn(rfqObj) &&
                vm.rfqsTable.filters.durationInMonths.start.filterFn(rfqObj) &&
                vm.rfqsTable.filters.durationInMonths.end.filterFn(rfqObj) &&
                vm.rfqsTable.filters.dealers.filterFn(rfqObj) &&
                vm.rfqsTable.filters.creditEvents.filterFn(rfqObj) &&
                vm.rfqsTable.filters.timeout.start.filterFn(rfqObj) &&
                vm.rfqsTable.filters.timeout.end.filterFn(rfqObj) &&
                vm.rfqsTable.filters.cdsValue.start.filterFn(rfqObj) &&
                vm.rfqsTable.filters.cdsValue.end.filterFn(rfqObj);
            });
        };

        vm.rfqsTable.filters.referenceEntity = GridTableUtil.idFilterFactory(vm.rfqsTable.filters.filterRfqs, 'referenceEntity');
        vm.rfqsTable.filters.timestampStr = GridTableUtil.textFilterFactory(vm.rfqsTable.filters.filterRfqs, 'timestampStr');
        vm.rfqsTable.filters.id = GridTableUtil.idFilterFactory(vm.rfqsTable.filters.filterRfqs, 'id');
        vm.rfqsTable.filters.durationInMonths = GridTableUtil.doubleNumberFilterFactory(vm.rfqsTable.filters.filterRfqs, 'durationInMonths');
        vm.rfqsTable.filters.dealers = GridTableUtil.listFilterFactory(vm.rfqsTable.filters.filterRfqs, 'dealers');
        vm.rfqsTable.filters.creditEvents = GridTableUtil.listFilterFactory(vm.rfqsTable.filters.filterRfqs, 'creditEvents');
        vm.rfqsTable.filters.timeout = GridTableUtil.doubleNumberFilterFactory(vm.rfqsTable.filters.filterRfqs, 'timeout');
        vm.rfqsTable.filters.cdsValue = GridTableUtil.doubleNumberFilterFactory(vm.rfqsTable.filters.filterRfqs, 'cdsValue');

        setInterval(function() {
            if (vm.rfqsTable.filters.timeout.start.value.length || vm.rfqsTable.filters.timeout.end.value.length) {
                vm.rfqsTable.options.data = vm.rfqsTable.options.data.filter(function(rfqObj) {
                    return vm.rfqsTable.filters.timeout.start.filterFn(rfqObj) &&
                        vm.rfqsTable.filters.timeout.end.filterFn(rfqObj);
                });
            }
        }, 1000);

        /**
         * Bottom table
         */

        vm.quotesTable = { options: {} };

        var quoteCallbackName = 'quotesTable';
        var selectedRfq;

        QuotesService.getQuotesByClientGroupByRfqId(currentAccount).success(function(data) {
            $.map(data, function(v, k) {
                quotesByRfqId[k] = v.map(function(quoteObj) {
                    var quote = $.extend(true,{},quoteObj);
                    quote = prepareQuote(quote);
                    return quote;
                });
            });
        });

        WebSocketsManager.webSockets.quotes.client.addCallback(quoteCallbackName, function(quoteObj) {
            quoteObj = prepareQuote(quoteObj);

            if (quotesByRfqId[quoteObj.rfqId]) {
                quotesByRfqId[quoteObj.rfqId].push(quoteObj);
            } else {
                quotesByRfqId[quoteObj.rfqId] = [quoteObj];
            }
            updateQuoteTable(selectedRfq);
        });

        vm.quotesTable.options = QuotesTableService.options();

        vm.rfqsTable.options.onRegisterApi = function(gridApi) {
            vm.rfqsTable.gridApi = gridApi;

            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                selectedRfq = row.entity;
                updateQuoteTable(row.entity);
            });
        };

        function disableButtons(quotes) {
            return quotes.map(function(quote) {
                quote.rfqExpired = true;
                return quote;
            });
        }

        function updateQuoteTable(currentRfq) {
            var relatedQuotes = quotesByRfqId[currentRfq.id];

            if (relatedQuotes) {
                if (currentRfq.expired) {
                    relatedQuotes = disableButtons(relatedQuotes);
                }
                vm.quotesTable.options.data = relatedQuotes;
            }
            else {
                vm.quotesTable.options.data = [];
            }
        }

        setInterval(function() {
            vm.rfqsTable.gridApi.core.refresh();
        }, 1000);

        vm.accept = function(quote) {
            quote.loading = true;
            TradeService.submitTrade(selectedRfq.id, quote.id, selectedRfq.durationInMonths, quote.client, quote.dealer, selectedRfq.creditEvents, selectedRfq.cdsValue, selectedRfq.originator, quote.premium, quote.referenceEntity)
            .then(
                AlertsService.accept.success(quote, function(quote) {
                    quote.loading = false;
                    quote.accepted = true;
                    quote.timeout = "Accepted";
                }),
                AlertsService.accept.error(quote, function(quote) {
                    quote.loading = false;
                })
            );
        };

        vm.disableButton = function(quote) {
            return FormUtilsService.isExpired(quote.timeout) || quote.accepted || quote.rfqExpired;
        };

        $scope.$on('$destroy', function() {
            WebSocketsManager.webSockets.rfq.client.removeCallback(rfqCallbackName);
            WebSocketsManager.webSockets.quotes.client.removeCallback(quoteCallbackName);
        });

        function prepareQuote(quote) {
            quote = TimeoutManagerService.setUpTimeout(quote);
            quote.rfqExpired = false;
            quote.loading = false;
            quote.accepted = false;
            return quote;
        }
    }
})();