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

        vm.tradesTable.loading = true;

        TradeService.getTradesByAccount().success(function(data) {
            vm.tradesTable.loading = false;

            vm.tradesTable.options.data = data.map(function(tradeObj) {
                var trade = Object.create(tradeObj);
                trade.id = tradeObj._id.$oid;
                delete trade._id;

                return trade;
            });
        });

        $scope.$on('$destroy', function() {
            //TradeService.closeTradesStream();
        });
    }
})();