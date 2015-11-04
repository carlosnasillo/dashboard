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

        vm.chartOptions = {
            segmentShowStroke: true,
            segmentStrokeColor: "#fff",
            segmentStrokeWidth: 2,
            percentageInnerCutout: 45,
            animationSteps: 100,
            animationEasing: "easeOutBounce",
            animateRotate: true,
            animateScale: false,
            responsive: true
        };

        vm.analytics = {};

        /**
         * LendingClug data
         */
        vm.analytics.lendingClub = {};
        lendingClubAnalytics.numLoans.success(function(numLoans) {
            vm.analytics.lendingClub.numLoans = numLoans;
        });
        lendingClubAnalytics.liquidity.success(function(liquidity) {
            vm.analytics.lendingClub.liquidity = liquidity;
        });
        lendingClubAnalytics.liquidityByGrade.success(function(liquidityByGrade) {
            vm.analytics.lendingClub.liquidityByGradeLabels = Object.keys(liquidityByGrade);
            vm.analytics.lendingClub.liquidityByGradeConverted = [];
            $.map(liquidityByGrade, function(v, i) {
                vm.analytics.lendingClub.liquidityByGradeConverted.push(v);
            });
        });
        lendingClubAnalytics.dailyChangeInNumLoans.success(function(dailyChangeInNumLoans) {
            vm.analytics.lendingClub.dailyChangeInNumLoans = dailyChangeInNumLoans;
        });
        lendingClubAnalytics.dailyChangeInLiquidity.success(function(dailyChangeInLiquidity) {
            vm.analytics.lendingClub.dailyChangeInLiquidity = dailyChangeInLiquidity;
        });

        /**
         * Prosper (mocked) data
         */
        vm.analytics.prosper = {};

        vm.analytics.prosper.numLoans = 872;
        vm.analytics.prosper.liquidity = 12267921;

        vm.analytics.prosper.dailyChangeInNumLoans = -100;
        vm.analytics.prosper.dailyChangeInLiquidity = 15000943;

        var prosperLiquidityByGrade = {AA: 53, A: 276, B: 231, C: 126, D: 43, E: 102, HR: 100};
        vm.analytics.prosper.liquidityByGradeConverted = [];
        vm.analytics.prosper.liquidityByGradeLabels = Object.keys(prosperLiquidityByGrade);
        $.map(prosperLiquidityByGrade, function(v, i) {
            vm.analytics.prosper.liquidityByGradeConverted.push(v);
        });
    }
})();