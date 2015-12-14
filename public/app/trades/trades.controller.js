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
* Created on 13/12/2015
*/

(function(){
    'use strict';

    angular
        .module('app')
        .controller('TradesController', TradesController);

    TradesController.$inject = ['TradeService', 'TradesTableService', '$scope'];

    function TradesController(TradeService, TradesTableService, $scope) {
        var vm = this;

        vm.tradesTable = {};
        vm.tradesTable.options = TradesTableService.options();

        vm.tradesTable.options.onRegisterApi = function(gridApi) {
            vm.tradesTable.gridApi = gridApi;
        };

        setInterval(function() {
            vm.tradesTable.gridApi.core.refresh();
        }, 1000);

        vm.tradesTable.loading = true;

        TradeService.getTradesByAccount().success(function(data) {
            vm.tradesTable.loading = false;
            vm.tradesTable.options.data = data.map(function(tradeObj) {
                var trade = Object.create(tradeObj);
                trade.creditEvent = TradeService.prettifyList(trade.creditEvents);

                return trade;
            });
        });

        var onWebSocketMessage = function(evt) {
            vm.tradesTable.loading = false;

            var tradeObject = TradeService.parseTrade(evt.data);

            if (vm.tradesTable.options.data) {
                vm.tradesTable.options.data.push(tradeObject);
            }
            else {
                vm.tradesTable.options.data = [tradeObject];
            }
        };

        TradeService.streamTrades( onWebSocketMessage );

        $scope.$on('$destroy', function() {
            TradeService.closeTradesStream();
        });
    }
})();