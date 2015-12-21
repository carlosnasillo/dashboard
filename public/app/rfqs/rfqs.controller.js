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

    RFQsController.$inject = ['RfqsTableService', 'RfqService', 'QuotesTableService', 'QuotesService', '$scope', 'TradeService', 'SweetAlert', '$timeout', 'AuthenticationService'];

    function RFQsController(RfqsTableService, RfqService, QuotesTableService, QuotesService, $scope, TradeService, SweetAlert, $timeout, AuthenticationService) {
        var vm = this;

        var quotesByRfqId = [];

        var currentAccount = AuthenticationService.getCurrentAccount();

        /**
         * Top table
         */
        var now = moment();

        vm.rfqsTable = { options: {} };
        vm.rfqsTable.loading = true;

        vm.rfqsTable.options = RfqsTableService.options();
        var rfqCallbackName = 'clientRfqTable';

        var onWebSocketMessage = function(rfqObject) {
            vm.rfqsTable.loading = false;

            rfqObject.expired = false;

            setUpTimeout(rfqObject);

            rfqObject.dealers = prettifyList(rfqObject.dealers);
            rfqObject.prettyCreditEvents = prettifyList(rfqObject.creditEvents);

            if (vm.rfqsTable.options.data) {
                vm.rfqsTable.options.data.push(rfqObject);
            }
            else {
                vm.rfqsTable.options.data = [rfqObject];
            }

            quotesByRfqId[rfqObject.id] = [];

            function prettifyList(uglyList) {
                var prettyRes = "";
                uglyList.map(function (dealer) {
                    prettyRes += dealer + ', ';
                });

                return prettyRes.substr(0, prettyRes.length - 2);
            }
        };

        RfqService.clientWs.addCallback(rfqCallbackName, onWebSocketMessage);

        RfqService.getRfqForClient(currentAccount).success(function(data) {
            vm.rfqsTable.loading = false;
            vm.rfqsTable.options.data = data.map(function(rfqObj) {
                var rfq = Object.create(rfqObj);

                rfq.prettyDealers = prettifyList(rfq.dealers);
                rfq.prettyCreditEvents = prettifyList(rfq.creditEvents);
                rfq.expired = false;
                setUpTimeout(rfq);

                quotesByRfqId[rfq.id] = [];

                function prettifyList(uglyList) {
                    var prettyRes = "";
                    uglyList.map(function (dealer) {
                        prettyRes += dealer + ', ';
                    });

                    return prettyRes.substr(0, prettyRes.length - 2);
                }

                return rfq;
            });

            $timeout(function() {
                if (vm.rfqsTable.gridApi.selection.selectRow) {
                    vm.rfqsTable.gridApi.selection.selectRow(vm.rfqsTable.options.data[vm.rfqsTable.options.data.length - 1]);
                }
            });
        });

        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }
        /**
         * Bottom table
         */

        vm.quotesTable = { options: {} };

        var quoteCallbackName = 'quotesTable';
        var selectedRfq;

        QuotesService.getQuotesByClientGroupByRfqId(currentAccount).success(function(data) {
            $.map(data, function(v, k) {
                data[k] = v.map(function(quoteObj) {
                    var quote = Object.create(quoteObj);
                    quote = setUpTimeout(quote);
                    quote.rfqExpired = false;
                    quote.loading = false;
                    quote.accepted = false;
                    return quote;
                });
            });
            quotesByRfqId = data;
        });

        var onNewQuote = function(quoteObj) {
            quoteObj = setUpTimeout(quoteObj);

            quoteObj.rfqExpired = false;
            quoteObj.loading = false;
            quoteObj.accepted = false;

            if (quotesByRfqId[quoteObj.rfqId]) {
                quotesByRfqId[quoteObj.rfqId].push(quoteObj);
            } else {
                quotesByRfqId[quoteObj.rfqId] = [quoteObj];
            }
            updateQuoteTable(selectedRfq);
        };

        QuotesService.clientWs.addCallback(quoteCallbackName, onNewQuote);

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

        var orderSuccess = function(quote) {
            return function() {
                SweetAlert.swal(
                    "Done !",
                    "Quote accepted !",
                    "success"
                );
                quote.loading = false;
                quote.accepted = true;
                quote.timeout = "Accepted";
            };
        };

        var orderError = function(quote) {
            return function() {
                SweetAlert.swal(
                    "Oops...",
                    "Something went wrong !",
                    "error"
                );
                quote.loading = false;
            };
        };

        vm.accept = function(quote) {
            quote.loading = true;
            TradeService.submitTrade(selectedRfq.id, quote.id, selectedRfq.durationInMonths, quote.client, quote.dealer, selectedRfq.creditEvents, selectedRfq.cdsValue, selectedRfq.originator, quote.premium)
            .then(orderSuccess(quote), orderError(quote));
        };

        vm.disableButton = function(quote) {
            return isExpired(quote.timeout) || quote.accepted || quote.rfqExpired;
        };

        $scope.$on('$destroy', function() {
            RfqService.clientWs.removeCallback(rfqCallbackName);
            QuotesService.clientWs.removeCallback(quoteCallbackName);
        });

        function isExpired(timeout) {
            return !isNumeric(timeout) || timeout <= 0;
        }

        function setUpTimeout(object) {
            var deadline = moment(object.timestamp * 1).add(object.timeWindowInMinutes, 'minutes');
            var diff = deadline.diff(now);
            var duration = Math.round(moment.duration(diff).asSeconds());
            var counter = setInterval(function () {
                if (object.timeout == "Accepted") {
                    clearInterval(counter);
                }
                else {
                    if (duration > 0) {
                        duration = duration - 1;
                        object.timeout = duration;
                    }
                    else {
                        object.timeout = "Expired";
                        object.expired = true;
                        clearInterval(counter);
                    }
                }
            }, 1000);

            return object;
        }
    }
})();