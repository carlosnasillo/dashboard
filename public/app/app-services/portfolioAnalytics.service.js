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
        .factory('PortfolioAnalyticsService', function ($http) {
            var LCPortfolioAnalyticsPromise = null;

            var LCPortfolioAnalytics = function() {
                if (LCPortfolioAnalyticsPromise) {
                    return LCPortfolioAnalyticsPromise;
                } else {
                    LCPortfolioAnalyticsPromise = $http.get("/api/portfolio/analytics");
                    return LCPortfolioAnalyticsPromise;
                }
            };

            return {
                LCPortfolioAnalytics: LCPortfolioAnalytics()
            }
        });
})();