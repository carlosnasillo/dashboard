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

    IncomingRfqsController.$inject = ['RfqService', 'RfqsTableForDealerService', 'QuoteModalService', '$scope', 'AuthenticationService', 'QuotesByRfqTableService', 'QuotesService', '$timeout', 'FormUtilsService', 'TimeoutManagerService', 'ParseUtilsService'];

    function IncomingRfqsController(RfqService, RfqsTableForDealerService, QuoteModalService, $scope, AuthenticationService, QuotesByRfqTableService, QuotesService, $timeout, FormUtilsService, TimeoutManagerService, ParseUtilsService) {
        var vm = this;

        var currentAccount = AuthenticationService.getCurrentAccount();

        var selectedRfq;

        /**
         * Top table
         */

        var rfqsCallbackName = 'incomingRfqsTable';
        var quoteCallbackName = 'incomingQuotesTable';

        vm.rfqTable = {};
        vm.rfqTable.options = RfqsTableForDealerService.options();

        RfqService.dealerWs.addCallback(rfqsCallbackName, function(rfqObject) {
            rfqObject = TimeoutManagerService.setUpTimeout(rfqObject);

            if (vm.rfqTable.options.data) {
                vm.rfqTable.options.data.push(rfqObject);
            }
            else {
                vm.rfqTable.options.data = [rfqObject];
            }
        });

        RfqService.getRfqForDealer(currentAccount).success(function(data) {
            vm.rfqTable.options.data = data.map(function(rfqObj) {
                var rfq = TimeoutManagerService.setUpTimeout(rfqObj);
                rfq.prettyCreditEvents = ParseUtilsService.prettifyList(rfq.creditEvents);

                return rfq;
            });

            $timeout(function() {
                if (vm.rfqTable.gridApi.selection.selectRow) {
                    vm.rfqTable.gridApi.selection.selectRow(vm.rfqTable.options.data[vm.rfqTable.options.data.length - 1]);
                }
            });
        });

        vm.isExpired = FormUtilsService.isExpired;

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
                    quote = TimeoutManagerService.setUpTimeout(quote);

                    return quote;
                });
            });
        });

        QuotesService.dealerWs.addCallback(quoteCallbackName, function(quoteObj) {
            quoteObj = TimeoutManagerService.setUpTimeout(quoteObj);

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
    }
})();