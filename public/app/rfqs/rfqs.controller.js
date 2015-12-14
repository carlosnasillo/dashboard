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

    RFQsController.$inject = ['RfqsTableService', 'RfqService', 'QuotesTableService', 'QuotesService', '$scope', 'TradeService', 'SweetAlert'];

    function RFQsController(RfqsTableService, RfqService, QuotesTableService, QuotesService, $scope, TradeService, SweetAlert) {
        var vm = this;

        /**
         * Top table
         */
        var now = moment();

        vm.rfqsTable = { options: {} };
        vm.rfqsTable.loading = true;

        vm.rfqsTable.options = RfqsTableService.options();

        var onWebSocketMessage = function(evt) {
            vm.rfqsTable.loading = false;

            var rfqObject = RfqService.parseRfq(evt.data);

            setUpTimeout(rfqObject);

            rfqObject.dealers = prettifyList(rfqObject.dealers);
            rfqObject.prettyCreditEvents = prettifyList(rfqObject.creditEvents);

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

        RfqService.streamRfqForClient( onWebSocketMessage );

        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }

        /**
         * Bottom table
         */

        vm.quotesTable = { options: {} };

        var selectedRfq;
        var quotesByRfqId = {};

        var onNewQuote = function(evt) {

            var quoteObj = QuotesService.parseQuote(evt.data);
            quoteObj = setUpTimeout(quoteObj);
            quoteObj.loading = false;

            quoteObj.accepted = false;
            if (quotesByRfqId[quoteObj.rfqId]) {
                quotesByRfqId[quoteObj.rfqId].push(quoteObj);
                updateQuoteTable(selectedRfq);

            } else {
                quotesByRfqId[quoteObj.rfqId] = [quoteObj];
            }
        };


        QuotesService.streamQuotes(onNewQuote);

        vm.quotesTable.options = QuotesTableService.options();
        vm.rfqsTable.options.onRegisterApi = function(gridApi) {
            vm.rfqsTable.gridApi = gridApi;

            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                selectedRfq = row.entity;
                updateQuoteTable(row.entity);
            });
        };

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
            TradeService.submitTrade(selectedRfq.id, quote.id, selectedRfq.duration, quote.client, quote.dealer, selectedRfq.creditEvents, selectedRfq.cdsValue, selectedRfq.originator, quote.premium)
            .then(orderSuccess(quote), orderError(quote));
        };

        vm.disableButton = function(quote) {
            return isExpired(quote.timeout) || quote.accepted;
        };

        $scope.$on('$destroy', function() {
            RfqService.closeRfqStream();
            QuotesService.closeQuotesStream();
        });

        function updateQuoteTable(currentRfq) {
            if (quotesByRfqId[currentRfq.id]) {
                vm.quotesTable.options.data = quotesByRfqId[currentRfq.id];
            }
            else {
                vm.quotesTable.options.data = [];
            }
        }

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
                        clearInterval(counter);
                    }
                }
            }, 1000);

            return object;
        }
    }
})();