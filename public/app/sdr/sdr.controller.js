/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 07/01/2016
*/

(function() {
    'use strict';

    angular
        .module('app')
        .controller('SdrController', SdrController);

    SdrController.$inject = ['TradeService', '$filter', 'GridTableUtil', 'AnonymisedTradesTableService', '$scope', 'WebSocketsManager'];

    function SdrController(TradeService, $filter, GridTableUtil, AnonymisedTradesTableService, $scope, WebSocketsManager) {
        var vm = this;

        var callbackName = 'anonimisedTradeTAble';

        vm.tradesTable = {};
        vm.tradesTable.options = AnonymisedTradesTableService.options();
        vm.originalData = [];

        vm.tradesTable.options.onRegisterApi = function(gridApi) {
            vm.tradesTable.gridApi = gridApi;
        };

        setInterval(function() {
            vm.tradesTable.gridApi.core.refresh();
        }, 1000);

        TradeService.getTodaysAnonymisedTrades().success(function(data) {
            vm.tradesTable.options.data = data.map(function(tradeObj) {
                var trade = $.extend(true,{},tradeObj);
                trade.timestampToFormattedDate = $filter('date')(tradeObj.timestamp, 'dd/MM/yyyy');
                return trade;
            });
            vm.originalData = vm.tradesTable.options.data;
        });

        WebSocketsManager.webSockets.tradesAnonymised.addCallback(callbackName, function(tradeObject) {
            vm.tradesTable.loading = false;
            tradeObject.timestampToFormattedDate = $filter('date')(tradeObject.timestamp, 'dd/MM/yyyy');

            vm.originalData.push(tradeObject);
            vm.tradesTable.filters.filterTrades();
        });

        $scope.$on('$destroy', function() {
            WebSocketsManager.webSockets.tradesAnonymised.removeCallback(callbackName);
        });

        vm.tradesTable.filters = {};
        vm.tradesTable.filters.timestamp = GridTableUtil.dateFilterFactory(vm.originalData, function(filteredData) { vm.tradesTable.options.data = filteredData; }, 'timestampToFormattedDate');

        vm.tradesTable.filters.filterTrades = function () {
            vm.tradesTable.options.data = vm.originalData.filter(function (tradeObj) {
                return vm.tradesTable.filters.referenceEntities.filterFn(tradeObj) &&
                    vm.tradesTable.filters.durationInMonths.start.filterFn(tradeObj) &&
                    vm.tradesTable.filters.durationInMonths.end.filterFn(tradeObj) &&
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

        vm.tradesTable.filters.referenceEntities = GridTableUtil.listFilterFactory(vm.tradesTable.filters.filterTrades, 'referenceEntities');
        vm.tradesTable.filters.durationInMonths = GridTableUtil.doubleNumberFilterFactory(vm.tradesTable.filters.filterTrades, 'durationInMonths');
        vm.tradesTable.filters.cdsValue = GridTableUtil.doubleNumberFilterFactory(vm.tradesTable.filters.filterTrades, 'cdsValue');
        vm.tradesTable.filters.premium = GridTableUtil.doubleNumberFilterFactory(vm.tradesTable.filters.filterTrades, 'premium');

        $scope.$watch('vm.tradesTable.filters.timestamp.start.value', vm.tradesTable.filters.filterTrades, false);
        $scope.$watch('vm.tradesTable.filters.timestamp.end.value', vm.tradesTable.filters.filterTrades, false);
    }
})();