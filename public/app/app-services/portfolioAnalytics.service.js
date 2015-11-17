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
            var notesAcquiredTodayByGradePromise = null;
            var notesAcquiredTodayByYieldPromise = null;
            var notesAcquiredTodayByPurposePromise = null;
            var notesAcquiredThisYearByMonthByGradePromise = null;
            var notesAcquiredThisYearByMonthByYieldPromise = null;
            var notesAcquiredThisYearByMonthByPurposePromise = null;

            var LCPortfolioAnalytics = function() {
                if (LCPortfolioAnalyticsPromise) {
                    return LCPortfolioAnalyticsPromise;
                } else {
                    LCPortfolioAnalyticsPromise = $http.get("/api/portfolio/analytics/lendingClub");
                    return LCPortfolioAnalyticsPromise;
                }
            };

            var notesAcquiredTodayByGrade = function() {
                if (notesAcquiredTodayByGradePromise) {
                    return notesAcquiredTodayByGradePromise;
                } else {
                    notesAcquiredTodayByGradePromise = $http.get("/api/portfolio/analytics/notesAcquiredTodayByGrade");
                    return notesAcquiredTodayByGradePromise;
                }
            };

            var notesAcquiredTodayByYield = function() {
                if (notesAcquiredTodayByYieldPromise) {
                    return notesAcquiredTodayByYieldPromise;
                } else {
                    notesAcquiredTodayByYieldPromise = $http.get("/api/portfolio/analytics/notesAcquiredTodayByYield");
                    return notesAcquiredTodayByYieldPromise;
                }
            };

            var notesAcquiredTodayByPurpose = function() {
                if (notesAcquiredTodayByPurposePromise) {
                    return notesAcquiredTodayByPurposePromise;
                } else {
                    notesAcquiredTodayByPurposePromise = $http.get("/api/portfolio/analytics/notesAcquiredTodayByPurpose");
                    return notesAcquiredTodayByPurposePromise;
                }
            };

            var notesAcquiredThisYearByMonthByGrade = function() {
                if (notesAcquiredThisYearByMonthByGradePromise) {
                    return notesAcquiredThisYearByMonthByGradePromise;
                } else {
                    notesAcquiredThisYearByMonthByGradePromise = $http.get("/api/portfolio/analytics/notesAcquiredThisYearByMonthByGrade");
                    return notesAcquiredThisYearByMonthByGradePromise;
                }
            };

            var notesAcquiredThisYearByMonthByYield = function() {
                if (notesAcquiredThisYearByMonthByYieldPromise) {
                    return notesAcquiredThisYearByMonthByYieldPromise;
                } else {
                    notesAcquiredThisYearByMonthByYieldPromise = $http.get("/api/portfolio/analytics/notesAcquiredThisYearByMonthByYield");
                    return notesAcquiredThisYearByMonthByYieldPromise;
                }
            };

            var notesAcquiredThisYearByMonthByPurpose = function() {
                if (notesAcquiredThisYearByMonthByPurposePromise) {
                    return notesAcquiredThisYearByMonthByPurposePromise;
                } else {
                    notesAcquiredThisYearByMonthByPurposePromise = $http.get("/api/portfolio/analytics/notesAcquiredThisYearByMonthByPurpose");
                    return notesAcquiredThisYearByMonthByPurposePromise;
                }
            };


            return {
                LCPortfolioAnalytics: new LCPortfolioAnalytics(),
                notesAcquiredTodayByGrade: notesAcquiredTodayByGrade(),
                notesAcquiredTodayByYield: notesAcquiredTodayByYield(),
                notesAcquiredTodayByPurpose: notesAcquiredTodayByPurpose(),
                notesAcquiredThisYearByMonthByGrade: notesAcquiredThisYearByMonthByGrade(),
                notesAcquiredThisYearByMonthByYield: notesAcquiredThisYearByMonthByYield(),
                notesAcquiredThisYearByMonthByPurpose: notesAcquiredThisYearByMonthByPurpose()
            };
        });
})();