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