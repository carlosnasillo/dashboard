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

    MainDashboardController.$inject = ['lendingClubAnalytics', 'chartUtilsService'];

    function MainDashboardController(lendingClubAnalytics, chartUtilsService) {
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
         * LendingClub data
         */
        vm.analytics.lendingClub = {};

        vm.analytics.lendingClub.numLoans = 740;
        vm.analytics.lendingClub.liquidity = 11094975;

        vm.analytics.lendingClub.dailyChangeInNumLoans = 7;
        vm.analytics.lendingClub.dailyChangeInLiquidity = 113000;

        var LCLiquidityByGrade = { C: 1, E: 739 };

        vm.analytics.lendingClub.liquidityByGrade = chartUtilsService.fromMapToC3StyleData(LCLiquidityByGrade);

        //lendingClubAnalytics.analytics().success(function(analytics) {
        //    vm.analytics.lendingClub = Object.create(analytics);
        //    vm.analytics.lendingClub.liquidityByGrade = chartUtilsService.fromMapToC3StyleData(analytics.liquidityByGrade);
        //});

        /**
         * Prosper (mocked) data
         */
        vm.analytics.prosper = {};

        vm.analytics.prosper.numLoans = 872;
        vm.analytics.prosper.liquidity = 12267921;

        vm.analytics.prosper.dailyChangeInNumLoans = -100;
        vm.analytics.prosper.dailyChangeInLiquidity = 15000943;

        var prosperLiquidityByGrade = {AA: 53, A: 276, B: 231, C: 126, D: 43, E: 102, HR: 100};
        vm.analytics.prosper.liquidityByGrade = chartUtilsService.fromMapToC3StyleData(prosperLiquidityByGrade);
    }
})();