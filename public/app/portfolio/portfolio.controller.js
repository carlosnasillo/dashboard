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

        vm.tab = 1;
        vm.changeTab = function(tabId) {
            vm.tab = tabId;
        };

        /**
         * Lending Club mocked data
         */
        vm.lendingClubPortfolioAnalytics = {};
        PortfolioAnalyticsService.LCPortfolioAnalytics().then(function(analytics) {
            vm.chartOptions = {
                segmentShowStroke: true,
                segmentStrokeColor: "#fff",
                segmentStrokeWidth: 2,
                percentageInnerCutout: 45,
                animationSteps: 100,
                animationEasing: "easeOutBounce",
                animateRotate: true,
                animateScale: false,
                responsive: true,
                maintainAspectRatio: true
            };

            vm.lendingClubPortfolioAnalytics = analytics;

            vm.lendingClubPortfolioAnalytics.notesByGradeLabels = Object.keys(vm.lendingClubPortfolioAnalytics.notesByGrade);
            vm.lendingClubPortfolioAnalytics.notesByGradeConverted = [];
            $.map(vm.lendingClubPortfolioAnalytics.notesByGrade, function(v, i) {
                vm.lendingClubPortfolioAnalytics.notesByGradeConverted.push(v);
            });

            vm.lendingClubPortfolioAnalytics.notesByStateLabels = Object.keys(vm.lendingClubPortfolioAnalytics.notesByState);
            vm.lendingClubPortfolioAnalytics.notesByStateConverted = [];
            $.map(vm.lendingClubPortfolioAnalytics.notesByState, function(v, i) {
                vm.lendingClubPortfolioAnalytics.notesByStateConverted.push(v);
            });

            var withAdaptedKeys = {};
            for ( var k in vm.lendingClubPortfolioAnalytics.principalOutstandingByYield ) {
                if ( vm.lendingClubPortfolioAnalytics.principalOutstandingByYield.hasOwnProperty(k) ) {
                    withAdaptedKeys[k.replace(';','-') + "%"] = vm.lendingClubPortfolioAnalytics.principalOutstandingByYield[k];
                }
            }
            vm.lendingClubPortfolioAnalytics.principalOutstandingByYield = withAdaptedKeys;

            var invertedData = { 'A':{}, 'B':{}, 'C':{}, 'D':{}, 'E':{}, 'F':{}, 'G':{} };
            $.map(vm.lendingClubPortfolioAnalytics.principalOutstandingByStateByGrade, function(v, i) {
                invertedData.A[i] = v.A;
                invertedData.B[i] = v.B;
                invertedData.C[i] = v.C;
                invertedData.D[i] = v.D;
                invertedData.E[i] = v.E;
                invertedData.F[i] = v.F;
                invertedData.G[i] = v.G;
            });

            vm.lendingClubPortfolioAnalytics.principalOutstandingByStateByGrade = invertedData;
            vm.lendingClubPortfolioAnalytics.notesByStateByGrade = invertedData;
        });

        PortfolioAnalyticsService.prosperPortfolioAnalytics().then(function(analytics) {
            /**
             * Prosper entirely mocked data
             */
            vm.prosperPortfolioAnalytics = analytics;

            vm.prosperPortfolioAnalytics.notesByGradeLabels = Object.keys(vm.prosperPortfolioAnalytics.notesByGrade);
            vm.prosperPortfolioAnalytics.notesByGradeConverted = [];
            $.map(vm.prosperPortfolioAnalytics.notesByGrade, function(v, i) {
                vm.prosperPortfolioAnalytics.notesByGradeConverted.push(v);
            });

            vm.prosperPortfolioAnalytics.notesByStateLabels = Object.keys(vm.prosperPortfolioAnalytics.notesByState);
            vm.prosperPortfolioAnalytics.notesByStateConverted = [];
            $.map(vm.prosperPortfolioAnalytics.notesByState, function(v, i) {
                vm.prosperPortfolioAnalytics.notesByStateConverted.push(v);
            });

            var withAdaptedKeys = {};
            for ( var k in vm.prosperPortfolioAnalytics.principalOutstandingByYield ) {
                if ( vm.prosperPortfolioAnalytics.principalOutstandingByYield.hasOwnProperty(k) ) {
                    withAdaptedKeys[k.replace(';','-') + "%"] = vm.prosperPortfolioAnalytics.principalOutstandingByYield[k];
                }
            }
            vm.prosperPortfolioAnalytics.principalOutstandingByYield = withAdaptedKeys;

            vm.prosperPortfolioAnalytics.principalOutstandingByStateByGrade = {
                'FullyPaid': { 'A': 800000, 'B': 1200000, 'C': 1400000, 'D': 1300000, 'E': 50000, 'F': 80000, 'G': 3000 },
                'Current': { 'A': 200000, 'B': 400000, 'C': 500000, 'D': 300000, 'E': 50000, 'F': 80000, 'G': 3000 },
                'InGracePeriod': { 'A': 100000, 'B': 200000, 'C': 400000, 'D': 600000, 'E': 50000, 'F': 80000, 'G': 3000 },
                'Late16-30days': { 'A': 800000, 'B': 1200000, 'C': 1400000, 'D': 1300000, 'E': 50000, 'F': 80000, 'G': 3000 },
                'Late31-120Days': { 'A': 200000, 'B': 400000, 'C': 500000, 'D': 300000, 'E': 50000, 'F': 80000, 'G': 3000 },
                'Defaulted': { 'A': 800000, 'B': 1200000, 'C': 1400000, 'D': 1300000, 'E': 50000, 'F': 80000, 'G': 3000 },
                'Charged Off': { 'A': 200000, 'B': 400000, 'C': 500000, 'D': 300000, 'E': 50000, 'F': 80000, 'G': 3000 }
            };

            var invertedData = { 'A':{}, 'B':{}, 'C':{}, 'D':{}, 'E':{}, 'F':{}, 'G':{} };
            $.map(vm.lendingClubPortfolioAnalytics.principalOutstandingByStateByGrade, function(v, i) {
                invertedData.A[i] = v.A;
                invertedData.B[i] = v.B;
                invertedData.C[i] = v.C;
                invertedData.D[i] = v.D;
                invertedData.E[i] = v.E;
                invertedData.F[i] = v.F;
                invertedData.G[i] = v.G;
            });

            vm.prosperPortfolioAnalytics.principalOutstandingByStateByGrade = invertedData;
            vm.prosperPortfolioAnalytics.notesByStateByGrade = invertedData;

        });
    }
})();