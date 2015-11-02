/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

/**
 * Created by julienderay on 26/10/2015.
 */

// the list controller
(function () {
    'use strict';

    angular
        .module('app')
        .controller('MainDashboardController', MainDashboardController);

    MainDashboardController.$inject = ['lendingClubAnalytics'];

    function MainDashboardController(lendingClubAnalytics) {
        var vm = this;

        vm.analytics = {};
        lendingClubAnalytics.numLoans.success(function(numLoans) {
            vm.analytics.numLoans = numLoans;
        });
        lendingClubAnalytics.liquidity.success(function(liquidity) {
            vm.analytics.liquidity = liquidity;
        });
        lendingClubAnalytics.liquidityByGrade.success(function(liquidityByGrade) {
            vm.analytics.liquidityByGrade = liquidityByGrade;
        });
        lendingClubAnalytics.dailyChangeInNumLoans.success(function(dailyChangeInNumLoans) {
            vm.analytics.dailyChangeInNumLoans = dailyChangeInNumLoans;
        });
        lendingClubAnalytics.dailyChangeInLiquidity.success(function(dailyChangeInLiquidity) {
            vm.analytics.dailyChangeInLiquidity = dailyChangeInLiquidity;
        });
    }
})();