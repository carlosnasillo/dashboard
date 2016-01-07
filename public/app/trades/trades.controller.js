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
* Created on 13/12/2015
*/

(function(){
    'use strict';

    angular
        .module('app')
        .controller('TradesController', TradesController);

    TradesController.$inject = ['TradeService', 'TradesTableService', '$scope', 'AuthenticationService', 'WebSocketsManager', '$filter', 'GridTableUtil'];

    function TradesController(TradeService, TradesTableService, $scope, AuthenticationService, WebSocketsManager, $filter, GridTableUtil) {
        var vm = this;

        var currentAccount = AuthenticationService.getCurrentAccount();
        var callbackName = 'tradesTable';

        vm.tradesTable = {};
        vm.tradesTable.options = TradesTableService.options();
        vm.originalData = [];

        vm.tradesTable.options.onRegisterApi = function(gridApi) {
            vm.tradesTable.gridApi = gridApi;
        };

        setInterval(function() {
            vm.tradesTable.gridApi.core.refresh();
        }, 1000);

        vm.tradesTable.loading = true;

        TradeService.getTradesByAccount(currentAccount).success(function(data) {
            vm.tradesTable.loading = false;
            vm.tradesTable.options.data = data.map(function(tradeObj) {
                var trade = $.extend(true,{},tradeObj);
                trade.side = getSide(currentAccount, tradeObj.client);
                trade.timestampToFormattedDate = $filter('date')(tradeObj.timestamp, 'dd/MM/yyyy');

                return trade;
            });
            vm.originalData = vm.tradesTable.options.data;
        });

        WebSocketsManager.webSockets.trades.addCallback(callbackName, function(tradeObject) {
            vm.tradesTable.loading = false;
            tradeObject.side = getSide(currentAccount, tradeObject.client);
            tradeObject.timestampToFormattedDate = $filter('date')(tradeObject.timestamp, 'dd/MM/yyyy');

            vm.originalData.push(tradeObject);
            vm.tradesTable.filters.filterTrades();
        });

        $scope.$on('$destroy', function() {
            WebSocketsManager.webSockets.trades.removeCallback(callbackName);
        });

        vm.tradesTable.filters = {};
        vm.tradesTable.filters.timestamp = GridTableUtil.dateFilterFactory(vm.originalData, function(filteredData) { vm.tradesTable.options.data = filteredData; }, 'timestampToFormattedDate');

        vm.tradesTable.filters.filterTrades = function () {
            vm.tradesTable.options.data = vm.originalData.filter(function (tradeObj) {
                return vm.tradesTable.filters.id.filterFn(tradeObj) &&
                vm.tradesTable.filters.referenceEntities.filterFn(tradeObj) &&
                vm.tradesTable.filters.side.filterFn(tradeObj) &&
                vm.tradesTable.filters.client.filterFn(tradeObj) &&
                vm.tradesTable.filters.dealer.filterFn(tradeObj) &&
                vm.tradesTable.filters.rfqId.filterFn(tradeObj) &&
                vm.tradesTable.filters.quoteId.filterFn(tradeObj) &&
                vm.tradesTable.filters.durationInMonths.start.filterFn(tradeObj) &&
                vm.tradesTable.filters.durationInMonths.end.filterFn(tradeObj) &&
                vm.tradesTable.filters.creditEvents.filterFn(tradeObj) &&
                vm.tradesTable.filters.cdsValue.start.filterFn(tradeObj) &&
                vm.tradesTable.filters.cdsValue.end.filterFn(tradeObj) &&
                vm.tradesTable.filters.premium.start.filterFn(tradeObj) &&
                vm.tradesTable.filters.premium.end.filterFn(tradeObj);
            });
            GridTableUtil.applyDateFilter(
                vm.tradesTable.filters.timestamp.start.value,
                vm.tradesTable.filters.timestamp.end.value,
                'timestampToFormattedDate',
                vm.tradesTable.options.data,
                function (filteredData) {
                    vm.tradesTable.options.data = filteredData;
                }
            );
        };

        vm.tradesTable.filters.id = GridTableUtil.idFilterFactory(vm.tradesTable.filters.filterTrades, 'id');
        vm.tradesTable.filters.referenceEntities = GridTableUtil.listFilterFactory(vm.tradesTable.filters.filterTrades, 'referenceEntities');
        vm.tradesTable.filters.side = GridTableUtil.textFilterFactory(vm.tradesTable.filters.filterTrades, 'side');
        vm.tradesTable.filters.client = GridTableUtil.textFilterFactory(vm.tradesTable.filters.filterTrades, 'client');
        vm.tradesTable.filters.dealer = GridTableUtil.textFilterFactory(vm.tradesTable.filters.filterTrades, 'dealer');
        vm.tradesTable.filters.rfqId = GridTableUtil.idFilterFactory(vm.tradesTable.filters.filterTrades, 'rfqId');
        vm.tradesTable.filters.quoteId = GridTableUtil.idFilterFactory(vm.tradesTable.filters.filterTrades, 'quoteId');
        vm.tradesTable.filters.durationInMonths = GridTableUtil.doubleNumberFilterFactory(vm.tradesTable.filters.filterTrades, 'durationInMonths');
        vm.tradesTable.filters.creditEvents = GridTableUtil.listFilterFactory(vm.tradesTable.filters.filterTrades, 'creditEvents');
        vm.tradesTable.filters.cdsValue = GridTableUtil.doubleNumberFilterFactory(vm.tradesTable.filters.filterTrades, 'cdsValue');
        vm.tradesTable.filters.premium = GridTableUtil.doubleNumberFilterFactory(vm.tradesTable.filters.filterTrades, 'premium');

        $scope.$watch('vm.tradesTable.filters.timestamp.start.value', vm.tradesTable.filters.filterTrades, false);
        $scope.$watch('vm.tradesTable.filters.timestamp.end.value', vm.tradesTable.filters.filterTrades, false);

        function getSide(currentAccount, client) {
            return client == currentAccount ? 'Buy' : 'Sell';
        }
    }
})();