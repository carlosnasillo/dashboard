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

    TradesController.$inject = ['TradeService', 'TradesTableService', '$scope', 'AuthenticationService'];

    function TradesController(TradeService, TradesTableService, $scope, AuthenticationService) {
        var vm = this;

        var currentAccount = AuthenticationService.getCurrentAccount();
        var callbackName = 'tradesTable';

        vm.tradesTable = {};
        vm.tradesTable.options = TradesTableService.options();

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
                trade.creditEvents = TradeService.prettifyList(tradeObj.creditEvents);
                trade.side = getSide(currentAccount, tradeObj.client);

                return trade;
            });
        });

        TradeService.webSocket.addCallback(callbackName, function(tradeObject) {
            vm.tradesTable.loading = false;

            tradeObject.side = getSide(currentAccount, tradeObject.client);

            if (vm.tradesTable.options.data) {
                vm.tradesTable.options.data.push(tradeObject);
            }
            else {
                vm.tradesTable.options.data = [tradeObject];
            }
        });

        $scope.$on('$destroy', function() {
            TradeService.webSocket.removeCallback(callbackName);
        });

        function getSide(currentAccount, client) {
            return client == currentAccount ? 'Buy' : 'Sell';
        }
    }
})();