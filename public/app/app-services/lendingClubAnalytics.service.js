/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

/**
 * Created by julienderay on 27/10/2015.
 */

(function () {
    'use strict';

    angular
        .module('app')
        .factory('lendingClubAnalytics', function ($http) {
            var numLoansPromise = null;
            var liquidityPromise = null;
            var liquidityByGradePromise = null;
            var dailyChangeInNumLoansPromise = null;
            var dailyChangeInLiquidityPromise = null;

            var numLoans = function() {
                if (numLoansPromise) {
                    return numLoansPromise;
                } else {
                    numLoansPromise = $http.get("/api/analytics/lendingClub/numLoans");
                    return numLoansPromise;
                }
            };

            var liquidity = function() {
                if (liquidityPromise) {
                    return liquidityPromise;
                } else {
                    liquidityPromise = $http.get("/api/analytics/lendingClub/liquidity");
                    return liquidityPromise;
                }
            };

            var liquidityByGrade = function() {
                if (liquidityByGradePromise) {
                    return liquidityByGradePromise;
                } else {
                    liquidityByGradePromise = $http.get("/api/analytics/lendingClub/liquidityByGrade");
                    return liquidityByGradePromise;
                }
            };

            var dailyChangeInNumLoans = function() {
                if (dailyChangeInNumLoansPromise) {
                    return dailyChangeInNumLoansPromise;
                } else {
                    dailyChangeInNumLoansPromise = $http.get("/api/analytics/lendingClub/dailyChangeInNumLoans");
                    return dailyChangeInNumLoansPromise;
                }
            };

            var dailyChangeInLiquidity = function() {
                if (dailyChangeInLiquidityPromise) {
                    return dailyChangeInLiquidityPromise;
                } else {
                    dailyChangeInLiquidityPromise= $http.get("/api/analytics/lendingClub/dailyChangeInLiquidity");
                    return dailyChangeInLiquidityPromise;
                }
            };

            return {
                numLoans: numLoans(),
                liquidity: liquidity(),
                liquidityByGrade: liquidityByGrade(),
                dailyChangeInNumLoans: dailyChangeInNumLoans(),
                dailyChangeInLiquidity: dailyChangeInLiquidity()
            }
        });
})();