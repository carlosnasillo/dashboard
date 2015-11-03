/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

/**
 * Created by julienderay on 02/11/2015.
 */

(function () {
    'use strict';

    angular
        .module('app')
        .controller('PortfolioController', PortfolioController);

    PortfolioController.$inject = ['PortfolioAnalyticsService'];

    function PortfolioController(PortfolioAnalyticsService) {
        var vm = this;

        vm.lendingClubPortfolioAnalytics = {};
        PortfolioAnalyticsService.LCPortfolioAnalytics.success(function(analytics) {
            vm.lendingClubPortfolioAnalytics = analytics;

            vm.lendingClubPortfolioAnalytics.notesByGrade = {
                C: 300,
                B: 50,
                A: 100
            };

            vm.lendingClubPortfolioAnalytics.notesByState = {
                C: 500,
                B: 1000,
                A: 104
            };

            vm.lendingClubPortfolioAnalytics.principalOutstandingByGrade = {
                A: 21,
                B: 3,
                C: 15,
                D: 52,
                E: 52
            };

            vm.lendingClubPortfolioAnalytics.principalOutstandingByYield = {
                "10;12.9": 21,
                "16;18.9": 3,
                "19;21.9": 15,
                "22;24.9": 52
            };

            var withAdaptedKeys = {};
            for ( var k in vm.lendingClubPortfolioAnalytics.principalOutstandingByYield ) {
                if ( vm.lendingClubPortfolioAnalytics.principalOutstandingByYield.hasOwnProperty(k) ) {
                    withAdaptedKeys[k.replace(';','-') + "%"] = vm.lendingClubPortfolioAnalytics.principalOutstandingByYield[k];
                }
            }
            vm.lendingClubPortfolioAnalytics.principalOutstandingByYield = withAdaptedKeys;

            vm.lendingClubPortfolioAnalytics.principalOutstandingByTerm = {
                "36 months": 21,
                "60 months": 3
            };

            vm.lendingClubPortfolioAnalytics.principalOutstandingByStateByGrade = {
                'FullyPaid': { 'A': 800000, 'B': 1200000, 'C': 1400000, 'D': 1300000, 'E': 50000, 'F': 80000, 'G': 3000 },
                'Current': { 'A': 200000, 'B': 400000, 'C': 500000, 'D': 300000, 'E': 50000, 'F': 80000, 'G': 3000 },
                'InGracePeriod': { 'A': 100000, 'B': 200000, 'C': 400000, 'D': 600000, 'E': 50000, 'F': 80000, 'G': 3000 },
                'Late16-30days': { 'A': 800000, 'B': 1200000, 'C': 1400000, 'D': 1300000, 'E': 50000, 'F': 80000, 'G': 3000 },
                'Late31-120Days': { 'A': 200000, 'B': 400000, 'C': 500000, 'D': 300000, 'E': 50000, 'F': 80000, 'G': 3000 },
                'Defaulted': { 'A': 800000, 'B': 1200000, 'C': 1400000, 'D': 1300000, 'E': 50000, 'F': 80000, 'G': 3000 },
                'Charged Off': { 'A': 200000, 'B': 400000, 'C': 500000, 'D': 300000, 'E': 50000, 'F': 80000, 'G': 3000 }
            };

            vm.lendingClubPortfolioAnalytics.notesByStateByGrade = vm.lendingClubPortfolioAnalytics.principalOutstandingByStateByGrade;
        });
    }
})();