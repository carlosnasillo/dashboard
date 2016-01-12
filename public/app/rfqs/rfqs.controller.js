/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
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

    RFQsController.$inject = ['RfqsTableService', 'RfqService', 'QuotesTableService', 'QuotesService', '$scope', 'AlertsService', '$timeout', 'AuthenticationService', 'FormUtilsService', 'TimeoutManagerService', 'WebSocketsManager', 'GridTableUtil', '$filter'];

    function RFQsController(RfqsTableService, RfqService, QuotesTableService, QuotesService, $scope, AlertsService, $timeout, AuthenticationService, FormUtilsService, TimeoutManagerService, WebSocketsManager, GridTableUtil, $filter) {
        var vm = this;

        var quotesByRfqId = {};

        var currentAccount = AuthenticationService.getCurrentAccount();
        var currentUsername = AuthenticationService.getCurrentUsername();

        vm.originalData = { rfqs: [], quotes: [] };

        /**
         * Top table
         */
        vm.rfqsTable = { options: {} };
        vm.rfqsTable.loading = true;

        vm.rfqsTable.options = RfqsTableService.options();
        var rfqCallbackName = 'clientRfqTable';

        WebSocketsManager.webSockets.rfq.client.addCallback(rfqCallbackName, function(rfqObject) {
            vm.rfqsTable.loading = false;

            rfqObject.state = RfqService.states.outstanding;

            rfqObject = TimeoutManagerService.setUpTimeout(rfqObject, $scope);

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

                rfq.state = RfqService.states.outstanding;
                rfq.timestampStr = $filter('date')(rfqObj.timestamp, 'HH:mm:ss');
                rfq = TimeoutManagerService.setUpTimeout(rfq, $scope);

                return rfq;
            });

            vm.originalData.rfqs = vm.rfqsTable.options.data;

            $timeout(function() {
                selectFirstRow();
            });
        });

        vm.rfqsTable.filters = {};
        vm.rfqsTable.filters.filterRfqs = function () {
            vm.rfqsTable.options.data = vm.originalData.rfqs.filter(function (rfqObj) {
                var passFilter = vm.rfqsTable.filters.referenceEntities.filterFn(rfqObj) &&
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

                if (rfqObj.id === selectedRfq.id) {
                    if (!passFilter) {
                        vm.quotesTable.options.data = [];
                    }
                }

                return passFilter;
            });
        };

        vm.rfqsTable.filters.referenceEntities = GridTableUtil.listFilterFactory(vm.rfqsTable.filters.filterRfqs, 'referenceEntities');
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

            var quoteInTheTable;
            if (quoteObj.state === QuotesService.states.cancelled) {
                quoteInTheTable = retrieveQuoteFromLocalData(quoteObj);
                if (quoteInTheTable) {
                    quoteInTheTable.state = QuotesService.states.cancelled;
                }
                else {
                    addQuoteToTheTable(quoteObj);
                }
            }
            else if (quoteObj.state === QuotesService.states.accepted) {
                quoteInTheTable = retrieveQuoteFromLocalData(quoteObj);
                if (quoteInTheTable) {
                    quoteInTheTable.state = QuotesService.states.accepted;
                }
                else {
                    addQuoteToTheTable(quoteObj);
                }
            }
            else {
                addQuoteToTheTable(quoteObj);
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

        vm.quotesTable.filters = {};

        vm.quotesTable.filters.filterQuotes = function () {
            vm.quotesTable.options.data = vm.originalData.quotes.filter(function (quoteObj) {
                return vm.quotesTable.filters.timestampStr.filterFn(quoteObj) &&
                vm.quotesTable.filters.referenceEntities.filterFn(quoteObj) &&
                vm.quotesTable.filters.id.filterFn(quoteObj) &&
                vm.quotesTable.filters.dealer.filterFn(quoteObj) &&
                vm.quotesTable.filters.paymentPeriodicity.filterFn(quoteObj) &&
                vm.quotesTable.filters.premium.start.filterFn(quoteObj) &&
                vm.quotesTable.filters.premium.end.filterFn(quoteObj) &&
                vm.quotesTable.filters.timeout.start.filterFn(quoteObj) &&
                vm.quotesTable.filters.timeout.end.filterFn(quoteObj) &&
                vm.quotesTable.filters.state.filterFn(quoteObj);
            });
        };

        vm.quotesTable.filters.timestampStr = GridTableUtil.textFilterFactory(vm.quotesTable.filters.filterQuotes, 'timestampStr');
        vm.quotesTable.filters.referenceEntities = GridTableUtil.listFilterFactory(vm.quotesTable.filters.filterQuotes, 'referenceEntities');
        vm.quotesTable.filters.id = GridTableUtil.textFilterFactory(vm.quotesTable.filters.filterQuotes, 'id');
        vm.quotesTable.filters.dealer = GridTableUtil.textFilterFactory(vm.quotesTable.filters.filterQuotes, 'dealer');
        vm.quotesTable.filters.premium = GridTableUtil.doubleNumberFilterFactory(vm.quotesTable.filters.filterQuotes, 'premium');
        vm.quotesTable.filters.timeout = GridTableUtil.doubleNumberFilterFactory(vm.quotesTable.filters.filterQuotes, 'timeout');
        vm.quotesTable.filters.state = GridTableUtil.textFilterFactory(vm.quotesTable.filters.filterQuotes, 'state');
        vm.quotesTable.filters.paymentPeriodicity = GridTableUtil.textFilterFactory(vm.quotesTable.filters.filterQuotes, 'paymentPeriodicity');

        setInterval(function() {
            if (vm.quotesTable.filters.timeout.start.value.length || vm.quotesTable.filters.timeout.end.value.length) {
                vm.quotesTable.options.data = vm.quotesTable.options.data.filter(function(quoteObj) {
                    return vm.quotesTable.filters.timeout.start.filterFn(quoteObj) &&
                        vm.quotesTable.filters.timeout.end.filterFn(quoteObj);
                });
            }
        }, 1000);

        function disableButtons(quotes) {
            return quotes.map(function(quote) {
                quote.rfqExpired = true;
                return quote;
            });
        }

        function updateQuoteTable(currentRfq) {
            var relatedQuotes = quotesByRfqId[currentRfq.id];

            if (relatedQuotes) {
                if (currentRfq.state == RfqService.states.expired) {
                    relatedQuotes = disableButtons(relatedQuotes);
                }
                vm.quotesTable.options.data = relatedQuotes;
                vm.originalData.quotes = relatedQuotes;
                vm.quotesTable.filters.filterQuotes();
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
            QuotesService.accept(selectedRfq.id, quote.id, selectedRfq.durationInMonths, quote.client, currentUsername, quote.dealer, quote.submittedBy, selectedRfq.creditEvents, selectedRfq.cdsValue, quote.premium, quote.referenceEntities)
            .then(
                AlertsService.accept.success(quote, function(quote) {
                    quote.loading = false;
                }),
                AlertsService.accept.error(quote, function(quote) {
                    quote.loading = false;
                })
            );
        };

        vm.disableButton = function(quote) {
            return FormUtilsService.isExpired(quote.timeout) || quote.accepted;
        };

        $scope.$on('$destroy', function() {
            WebSocketsManager.webSockets.rfq.client.removeCallback(rfqCallbackName);
            WebSocketsManager.webSockets.quotes.client.removeCallback(quoteCallbackName);
        });

        function prepareQuote(quote) {
            quote = TimeoutManagerService.setUpTimeout(quote, $scope);
            quote.loading = false;
            quote.timestampStr = $filter('date')(quote.timestamp, 'HH:mm:ss');
            return quote;
        }

        function selectFirstRow() {
            if (vm.rfqsTable.gridApi.selection.selectRow) {
                vm.rfqsTable.gridApi.selection.selectRow(vm.rfqsTable.options.data[vm.rfqsTable.options.data.length - 1]);
            }
        }

        function retrieveQuoteFromLocalData(quoteObj) {
            return vm.originalData.quotes.filter(function (quote) {
                return quoteObj.id === quote.id;
            })[0];
        }

        function addQuoteToTheTable(quoteObj) {
            if (quotesByRfqId[quoteObj.rfqId]) {
                quotesByRfqId[quoteObj.rfqId].push(quoteObj);
            } else {
                quotesByRfqId[quoteObj.rfqId] = [quoteObj];
            }
        }
    }
})();