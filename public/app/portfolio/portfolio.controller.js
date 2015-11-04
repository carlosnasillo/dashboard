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
        PortfolioAnalyticsService.LCPortfolioAnalytics.success(function(analytics) {
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

            // Mock data, current data are 0 or empty
            vm.lendingClubPortfolioAnalytics.principalOutstanding = 4501543;
            vm.lendingClubPortfolioAnalytics.pendingInvestment = 209490;
            vm.lendingClubPortfolioAnalytics.currentNotes = 5380.43;

            vm.lendingClubPortfolioAnalytics.principalReceived = 422.594;
            vm.lendingClubPortfolioAnalytics.interestReceived = 35857;

            vm.lendingClubPortfolioAnalytics.notesByGrade = {
                C: 300,
                B: 50,
                A: 100
            };
            vm.lendingClubPortfolioAnalytics.notesByGradeLabels = Object.keys(vm.lendingClubPortfolioAnalytics.notesByGrade);
            vm.lendingClubPortfolioAnalytics.notesByGradeConverted = [];
            $.map(vm.lendingClubPortfolioAnalytics.notesByGrade, function(v, i) {
                vm.lendingClubPortfolioAnalytics.notesByGradeConverted.push(v);
            });

            vm.lendingClubPortfolioAnalytics.notesByState = {
                C: 500,
                B: 1000,
                A: 104
            };
            vm.lendingClubPortfolioAnalytics.notesByStateLabels = Object.keys(vm.lendingClubPortfolioAnalytics.notesByState);
            vm.lendingClubPortfolioAnalytics.notesByStateConverted = [];
            $.map(vm.lendingClubPortfolioAnalytics.notesByState, function(v, i) {
                vm.lendingClubPortfolioAnalytics.notesByStateConverted.push(v);
            });
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

        /**
         * Prosper entirely mocked data
         */
        vm.prosperPortfolioAnalytics = {};

        vm.prosperPortfolioAnalytics.principalOutstanding = 7396543;
        vm.prosperPortfolioAnalytics.pendingInvestment = 274028;
        vm.prosperPortfolioAnalytics.currentNotes = 7394.76;

        vm.prosperPortfolioAnalytics.principalReceived = 169.734;
        vm.prosperPortfolioAnalytics.interestReceived = 46293;

        vm.prosperPortfolioAnalytics.notesByGrade = {
            C: 400,
            B: 10,
            A: 300
        };
        vm.prosperPortfolioAnalytics.notesByGradeLabels = Object.keys(vm.prosperPortfolioAnalytics.notesByGrade);
        vm.prosperPortfolioAnalytics.notesByGradeConverted = [];
        $.map(vm.prosperPortfolioAnalytics.notesByGrade, function(v, i) {
            vm.prosperPortfolioAnalytics.notesByGradeConverted.push(v);
        });


        vm.prosperPortfolioAnalytics.notesByState = {
            C: 50,
            B: 2000,
            A: 154
        };
        vm.prosperPortfolioAnalytics.notesByStateLabels = Object.keys(vm.prosperPortfolioAnalytics.notesByState);
        vm.prosperPortfolioAnalytics.notesByStateConverted = [];
        $.map(vm.prosperPortfolioAnalytics.notesByState, function(v, i) {
            vm.prosperPortfolioAnalytics.notesByStateConverted.push(v);
        });

        vm.prosperPortfolioAnalytics.principalOutstandingByGrade = {
            A: 51,
            B: 22,
            C: 1,
            D: 53,
            E: 42
        };

        vm.prosperPortfolioAnalytics.principalOutstandingByYield = {
            "10;12.9": 43,
            "16;18.9": 53,
            "19;21.9": 1,
            "22;24.9": 5
        };

        var withAdaptedKeys = {};
        for ( var k in vm.prosperPortfolioAnalytics.principalOutstandingByYield ) {
            if ( vm.prosperPortfolioAnalytics.principalOutstandingByYield.hasOwnProperty(k) ) {
                withAdaptedKeys[k.replace(';','-') + "%"] = vm.prosperPortfolioAnalytics.principalOutstandingByYield[k];
            }
        }
        vm.prosperPortfolioAnalytics.principalOutstandingByYield = withAdaptedKeys;

        vm.prosperPortfolioAnalytics.principalOutstandingByTerm = {
            "36 months": 2,
            "60 months": 34
        };

        vm.prosperPortfolioAnalytics.principalOutstandingByStateByGrade = {
            'FullyPaid': { 'A': 800000, 'B': 1200000, 'C': 1400000, 'D': 1300000, 'E': 50000, 'F': 80000, 'G': 3000 },
            'Current': { 'A': 200000, 'B': 400000, 'C': 500000, 'D': 300000, 'E': 50000, 'F': 80000, 'G': 3000 },
            'InGracePeriod': { 'A': 100000, 'B': 200000, 'C': 400000, 'D': 600000, 'E': 50000, 'F': 80000, 'G': 3000 },
            'Late16-30days': { 'A': 800000, 'B': 1200000, 'C': 1400000, 'D': 1300000, 'E': 50000, 'F': 80000, 'G': 3000 },
            'Late31-120Days': { 'A': 200000, 'B': 400000, 'C': 500000, 'D': 300000, 'E': 50000, 'F': 80000, 'G': 3000 },
            'Defaulted': { 'A': 800000, 'B': 1200000, 'C': 1400000, 'D': 1300000, 'E': 50000, 'F': 80000, 'G': 3000 },
            'Charged Off': { 'A': 200000, 'B': 400000, 'C': 500000, 'D': 300000, 'E': 50000, 'F': 80000, 'G': 3000 }
        };

        vm.prosperPortfolioAnalytics.notesByStateByGrade = vm.prosperPortfolioAnalytics.principalOutstandingByStateByGrade;
    }
})();