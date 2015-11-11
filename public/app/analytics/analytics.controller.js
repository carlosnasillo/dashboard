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
        .controller('AnalyticsController', AnalyticsController);

    AnalyticsController.$inject = ['PortfolioAnalyticsService'];

    function AnalyticsController(PortfolioAnalyticsService) {
        var vm = this;

        vm.tab = 1;
        vm.changeTab = function(tabId) {
            vm.tab = tabId;
        };

        vm.analytics = {};

        /**
         * Mocked data but linked to backend (all empty at the moment)
         */
        PortfolioAnalyticsService.notesAcquiredTodayByGrade.success(function(ordersByGrade) {
            ordersByGrade = { "AA": 21, "A": 3, "B": 15, "C": 52, "D": 52 };
            vm.analytics.ordersByGrade = ordersByGrade;
        });

        PortfolioAnalyticsService.notesAcquiredTodayByYield.success(function(ordersByYield) {
            ordersByYield = { "5;8.9": 32, "9;12.9": 5, "13;16.9": 57, "17;22": 32 };
            var withAdaptedKeys = {};
            for ( var k in ordersByYield ) {
                if ( ordersByYield.hasOwnProperty(k) ) {
                    withAdaptedKeys[k.replace(';','-') + "%"] = ordersByYield[k];
                }
            }
            vm.analytics.ordersByYield = withAdaptedKeys;
        });

        PortfolioAnalyticsService.notesAcquiredTodayByPurpose.success(function(ordersByPurpose) {
            ordersByPurpose = { "100-999": 21, "1000-4999": 3, "5000-5999": 15, "6000-9999": 52, "10000-49999": 52 };
            vm.analytics.ordersByPurpose = ordersByPurpose;
        });

        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        PortfolioAnalyticsService.notesAcquiredThisYearByMonthByGrade.success(function(ordersByMonthByGrade) {
            ordersByMonthByGrade = {
                "1": { A: 13077, B: 9611, C: 8141, D: 11511, E: 7716, F: 12804, G: 17433 },
                "2": { A: 12511, B: 15871, C: 555, D: 11077, E: 15828, F: 840, G: 15733 },
                "3": { A: 1300, B: 13205, C: 9209, D: 5115, E: 4899, F: 19135, G: 16770 },
                "4": { A: 3215, B: 9539, C: 1378, D: 14592, E: 2774, F: 3591, G: 10048 },
                "5": { A: 19350, B: 11820, C: 4649, D: 83, E: 1404, F: 14185, G: 8189 },
                "6": { A: 2135, B: 10977, C: 8010, D: 5889, E: 9456, F: 14478, G: 12631 },
                "7": { A: 8474, B: 15372, C: 3152, D: 1179, E: 5323, F: 15272, G: 17524 },
                "8": { A: 12880, B: 4707, C: 14810, D: 3350, E: 17532, F: 12661, G: 8541 },
                "9": { A: 11393, B: 18429, C: 687, D: 10791, E: 16699, F: 13376, G: 5749 },
                "10": { A: 19865, B: 18552, C: 5955, D: 11862, E: 14782, F: 13603, G: 13445 },
                "11": { A: 17416, B: 10059, C: 15735, D: 11348, E: 17069, F: 7843, G: 17796 },
                "12": { A: 18905, B: 17072, C: 4945, D: 13275, E: 1247, F: 627, G: 16605 }
            };

            var invertedData = { 'A':{}, 'B':{}, 'C':{}, 'D':{}, 'E':{}, 'F':{}, 'G':{} };
            var firstMonth = (new Date().getMonth() + 2) % 12;
            firstMonth = (firstMonth == 0) ? 12 : firstMonth;

            var currentYear = new Date().getFullYear();

            var i = firstMonth;
            do {
                var year = (firstMonth - 1 < i) ? currentYear - 1 : currentYear;
                invertedData.A[months[i-1] + '-' + year] = ordersByMonthByGrade[i].A;
                invertedData.B[months[i-1] + '-' + year] = ordersByMonthByGrade[i].B;
                invertedData.C[months[i-1] + '-' + year] = ordersByMonthByGrade[i].C;
                invertedData.D[months[i-1] + '-' + year] = ordersByMonthByGrade[i].D;
                invertedData.E[months[i-1] + '-' + year] = ordersByMonthByGrade[i].E;
                invertedData.F[months[i-1] + '-' + year] = ordersByMonthByGrade[i].F;
                invertedData.G[months[i-1] + '-' + year] = ordersByMonthByGrade[i].G;

                i = i % 12 + 1;
            }
            while (i !== firstMonth);

            vm.analytics.ordersByMonthByGrade = invertedData;
            vm.analytics.ordersByMonthByYield = invertedData;
            vm.analytics.ordersByMonthByPurpose = invertedData;
        });

        /**
         * Mocked data and NOT linked to backend
         */
        vm.analytics.ordersByMarketplace = { "Lending Club": 21, "Prosper": 3 };
        vm.analytics.ordersByMechanism = { "Automatic": 41, "Manual": 44 };
        vm.analytics.ordersByPortion = { "Full": 25, "Fractional": 63 };

        vm.analytics.ordersByMonthlyReturn = {};
        vm.analytics.ordersByMonthlyReturn.labels = ['Oct14', 'Nov14', 'Dec14', 'Jan15', 'Feb15', 'Mar15', 'Apr15', 'May15', 'Jun15', 'Jul15', 'Aug15', 'Sep15', 'Oct'];
        vm.analytics.ordersByMonthlyReturn.series = [
            [1.4, 1.2, 1.5, 1.5, 1.46, 1.89, 2.1, 1.2, 1.5, 1.6, 1.45, 1.23],
            [1.2, 1.5, 1.5, 1.46, 1.89, 2.1, 1.2, 1.5, 1.6, 1.45, 1.23, 1.4],
            [1.46, 1.89, 2.1, 1.2, 1.5, 1.6, 1.45, 1.23, 1.4, 1.4, 1.2, 1.5]
        ];
    }
})();