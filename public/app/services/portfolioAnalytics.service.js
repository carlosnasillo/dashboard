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
        .factory('PortfolioAnalyticsService', function ($http, $q) {
            //var LCPortfolioAnalyticsPromise = null;
            //var prosperPortfolioAnalyticsPromise = null;
            var notesAcquiredTodayByGradePromise = null;
            var notesAcquiredTodayByYieldPromise = null;
            var notesAcquiredTodayByPurposePromise = null;
            var notesAcquiredThisYearByMonthByGradePromise = null;
            var notesAcquiredThisYearByMonthByYieldPromise = null;
            var notesAcquiredThisYearByMonthByPurposePromise = null;

            /**
             * Mocked data as LC portflio analytics are all at 0
             * @returns {Promise}
             */

             function LCPortfolioAnalyticsPromise() {
                return $q(function(resolve, reject) {
                    setTimeout(function() {
                        resolve({
                            principalOutstanding: 4501543,
                            pendingInvestment: 209490,
                            currentNotes: 5380.43,
                            principalReceived: 422.594,
                            interestReceived: 35857,
                            notesByGrade: {
                                C: 300,
                                B: 50,
                                A: 100
                            },
                            notesByState: {
                                C: 500,
                                B: 1000,
                                A: 104
                            },
                            principalOutstandingByGrade: {
                                A: 21,
                                B: 3,
                                C: 15,
                                D: 52,
                                E: 52
                            },
                            principalOutstandingByYield: {
                                "10;12.9": 21,
                                "16;18.9": 3,
                                "19;21.9": 15,
                                "22;24.9": 52
                            },
                            principalOutstandingByTerm: {
                                "36 months": 21,
                                "60 months": 3
                            },
                            principalOutstandingByStateByGrade: {
                                'FullyPaid': { 'A': 800000, 'B': 1200000, 'C': 1400000, 'D': 1300000, 'E': 50000, 'F': 80000, 'G': 3000 },
                                'Current': { 'A': 200000, 'B': 400000, 'C': 500000, 'D': 300000, 'E': 50000, 'F': 80000, 'G': 3000 },
                                'InGracePeriod': { 'A': 100000, 'B': 200000, 'C': 400000, 'D': 600000, 'E': 50000, 'F': 80000, 'G': 3000 },
                                'Late16-30days': { 'A': 800000, 'B': 1200000, 'C': 1400000, 'D': 1300000, 'E': 50000, 'F': 80000, 'G': 3000 },
                                'Late31-120Days': { 'A': 200000, 'B': 400000, 'C': 500000, 'D': 300000, 'E': 50000, 'F': 80000, 'G': 3000 },
                                'Defaulted': { 'A': 800000, 'B': 1200000, 'C': 1400000, 'D': 1300000, 'E': 50000, 'F': 80000, 'G': 3000 },
                                'Charged Off': { 'A': 200000, 'B': 400000, 'C': 500000, 'D': 300000, 'E': 50000, 'F': 80000, 'G': 3000 }
                            },
                            notesByStateByGrade: {
                                'FullyPaid': { 'A': 800000, 'B': 1200000, 'C': 1400000, 'D': 1300000, 'E': 50000, 'F': 80000, 'G': 3000 },
                                'Current': { 'A': 200000, 'B': 400000, 'C': 500000, 'D': 300000, 'E': 50000, 'F': 80000, 'G': 3000 },
                                'InGracePeriod': { 'A': 100000, 'B': 200000, 'C': 400000, 'D': 600000, 'E': 50000, 'F': 80000, 'G': 3000 },
                                'Late16-30days': { 'A': 800000, 'B': 1200000, 'C': 1400000, 'D': 1300000, 'E': 50000, 'F': 80000, 'G': 3000 },
                                'Late31-120Days': { 'A': 200000, 'B': 400000, 'C': 500000, 'D': 300000, 'E': 50000, 'F': 80000, 'G': 3000 },
                                'Defaulted': { 'A': 800000, 'B': 1200000, 'C': 1400000, 'D': 1300000, 'E': 50000, 'F': 80000, 'G': 3000 },
                                'Charged Off': { 'A': 200000, 'B': 400000, 'C': 500000, 'D': 300000, 'E': 50000, 'F': 80000, 'G': 3000 }
                            }
                        });
                    }, 1000);
                });
            }

            /**
             * Mocked data (Prosper not implemented yet)
             * @returns {Promis}
             */
            function prosperPortfolioAnalyticsPromise() {
                return $q(function (resolve, reject) {
                    setTimeout(function () {
                        resolve({
                            principalOutstanding: 7396543,
                            pendingInvestment: 274028,
                            currentNotes: 7394.76,
                            principalReceived: 169.734,
                            interestReceived: 46293,
                            notesByGrade: {
                                C: 400,
                                B: 10,
                                A: 300
                            },
                            notesByState: {
                                C: 50,
                                B: 2000,
                                A: 154
                            },
                            principalOutstandingByGrade: {
                                A: 51,
                                B: 22,
                                C: 1,
                                D: 53,
                                E: 42
                            },
                            principalOutstandingByYield: {
                                "10;12.9": 43,
                                "16;18.9": 53,
                                "19;21.9": 1,
                                "22;24.9": 5
                            },
                            principalOutstandingByTerm: {
                                "36 months": 2,
                                "60 months": 34
                            },
                            principalOutstandingByStateByGrade: {
                                'FullyPaid': { 'A': 800000, 'B': 1200000, 'C': 1400000, 'D': 1300000, 'E': 50000, 'F': 80000, 'G': 3000 },
                                'Current': { 'A': 200000, 'B': 400000, 'C': 500000, 'D': 300000, 'E': 50000, 'F': 80000, 'G': 3000 },
                                'InGracePeriod': { 'A': 100000, 'B': 200000, 'C': 400000, 'D': 600000, 'E': 50000, 'F': 80000, 'G': 3000 },
                                'Late16-30days': { 'A': 800000, 'B': 1200000, 'C': 1400000, 'D': 1300000, 'E': 50000, 'F': 80000, 'G': 3000 },
                                'Late31-120Days': { 'A': 200000, 'B': 400000, 'C': 500000, 'D': 300000, 'E': 50000, 'F': 80000, 'G': 3000 },
                                'Defaulted': { 'A': 800000, 'B': 1200000, 'C': 1400000, 'D': 1300000, 'E': 50000, 'F': 80000, 'G': 3000 },
                                'Charged Off': { 'A': 200000, 'B': 400000, 'C': 500000, 'D': 300000, 'E': 50000, 'F': 80000, 'G': 3000 }
                            },
                            notesByStateByGrade: {
                                'FullyPaid': { 'A': 800000, 'B': 1200000, 'C': 1400000, 'D': 1300000, 'E': 50000, 'F': 80000, 'G': 3000 },
                                'Current': { 'A': 200000, 'B': 400000, 'C': 500000, 'D': 300000, 'E': 50000, 'F': 80000, 'G': 3000 },
                                'InGracePeriod': { 'A': 100000, 'B': 200000, 'C': 400000, 'D': 600000, 'E': 50000, 'F': 80000, 'G': 3000 },
                                'Late16-30days': { 'A': 800000, 'B': 1200000, 'C': 1400000, 'D': 1300000, 'E': 50000, 'F': 80000, 'G': 3000 },
                                'Late31-120Days': { 'A': 200000, 'B': 400000, 'C': 500000, 'D': 300000, 'E': 50000, 'F': 80000, 'G': 3000 },
                                'Defaulted': { 'A': 800000, 'B': 1200000, 'C': 1400000, 'D': 1300000, 'E': 50000, 'F': 80000, 'G': 3000 },
                                'Charged Off': { 'A': 200000, 'B': 400000, 'C': 500000, 'D': 300000, 'E': 50000, 'F': 80000, 'G': 3000 }
                            }
                        });
                    }, 1000);
                });
            }

            var LCPortfolioAnalytics = function() {
                if (LCPortfolioAnalyticsPromise) {
                    return LCPortfolioAnalyticsPromise;
                } else {
                    LCPortfolioAnalyticsPromise = $http.get("/api/portfolio/analytics/lendingClub");
                    return LCPortfolioAnalyticsPromise;
                }
            };

            var ProsperPortfolioAnalytics = function() {
                if (prosperPortfolioAnalyticsPromise) {
                    return prosperPortfolioAnalyticsPromise;
                } else {
                    prosperPortfolioAnalyticsPromise = $http.get("/api/portfolio/analytics/prosper");
                    return prosperPortfolioAnalyticsPromise;
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
                prosperPortfolioAnalytics: new ProsperPortfolioAnalytics(),
                notesAcquiredTodayByGrade: notesAcquiredTodayByGrade(),
                notesAcquiredTodayByYield: notesAcquiredTodayByYield(),
                notesAcquiredTodayByPurpose: notesAcquiredTodayByPurpose(),
                notesAcquiredThisYearByMonthByGrade: notesAcquiredThisYearByMonthByGrade(),
                notesAcquiredThisYearByMonthByYield: notesAcquiredThisYearByMonthByYield(),
                notesAcquiredThisYearByMonthByPurpose: notesAcquiredThisYearByMonthByPurpose()
            };
        });
})();