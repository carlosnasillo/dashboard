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
            var analyticsPromise = null;

            var analytics = function() {
                if (analyticsPromise) {
                    return analyticsPromise;
                } else {
                    analyticsPromise = $http.get("/api/analytics/lendingClub");
                    return analyticsPromise;
                }
            };

            return {
                analytics: analytics
            };
        });
})();