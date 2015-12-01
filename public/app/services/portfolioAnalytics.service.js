/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

/**
* @author : julienderay
* Created on 02/11/2015
*/

(function () {
    'use strict';

    angular
        .module('app')
        .factory('PortfolioAnalyticsService', function ($http, $q) {
            //var LCPortfolioAnalyticsPromise = null;
            //var prosperPortfolioAnalyticsPromise = null;
            //var allPortfolioAnalyticsPromise = null;

            //var lcCurrentBalancePromise = null;
            //var prosperCurrentBalancePromise = null;

            //var totalCurrentBalancePromise = null;

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
            var mockedDataLC = {
                principalOutstanding: 4501543,
                pendingInvestment: 209490,
                currentNotes: 450,
                principalReceived: 422.594,
                interestReceived: 35857,
                notesByGrade: {
                    C: 300,
                    B: 50,
                    A: 100
                },
                notesByState: {
                    C: 100,
                    B: 200,
                    A: 150
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
            };

             function LCPortfolioAnalyticsPromise() {
                return $q(function(resolve, reject) {
                    setTimeout(function() {
                        resolve(mockedDataLC);
                    }, 1000);
                });
            }

            /**
             * Mocked data (Prosper not implemented yet)
             * @returns {Promise}
             */
            var mockedDataProsper = {
                principalOutstanding: 7396543,
                pendingInvestment: 274028,
                currentNotes: 710,
                principalReceived: 169.734,
                interestReceived: 46293,
                notesByGrade: {
                    C: 400,
                    B: 10,
                    A: 300
                },
                notesByState: {
                    C: 60,
                    B: 450,
                    A: 200
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
                    'Current': { 'A': 100000, 'B': 200000, 'C': 400000, 'D': 600000, 'E': 50000, 'F': 80000, 'G': 3000 },
                    'InGracePeriod': { 'A': 800000, 'B': 1200000, 'C': 1400000, 'D': 1300000, 'E': 50000, 'F': 80000, 'G': 3000 },
                    'Late16-30days': { 'A': 800000, 'B': 1200000, 'C': 1400000, 'D': 1300000, 'E': 50000, 'F': 80000, 'G': 3000 },
                    'Late31-120Days': { 'A': 200000, 'B': 400000, 'C': 500000, 'D': 300000, 'E': 50000, 'F': 80000, 'G': 3000 },
                    'Defaulted': { 'A': 200000, 'B': 400000, 'C': 500000, 'D': 300000, 'E': 50000, 'F': 80000, 'G': 3000 },
                    'Charged Off': { 'A': 200000, 'B': 400000, 'C': 500000, 'D': 300000, 'E': 50000, 'F': 80000, 'G': 3000 }
                },
                notesByStateByGrade: {
                    'FullyPaid': { 'A': 8000, 'B': 1200000, 'C': 1400000, 'D': 1300000, 'E': 5000, 'F': 80000, 'G': 3000 },
                    'Current': { 'A': 1000, 'B': 200000, 'C': 400000, 'D': 600000, 'E': 50000, 'F': 8000, 'G': 30000 },
                    'InGracePeriod': { 'A': 800000, 'B': 12000, 'C': 1400000, 'D': 130000, 'E': 500, 'F': 80000, 'G': 300 },
                    'Late16-30days': { 'A': 8000, 'B': 1200000, 'C': 14000, 'D': 1300000, 'E': 5000, 'F': 800, 'G': 30 },
                    'Late31-120Days': { 'A': 200000, 'B': 400000, 'C': 5000, 'D': 300000, 'E': 50000, 'F': 8000, 'G': 500000 },
                    'Defaulted': { 'A': 20000, 'B': 400000, 'C': 50000, 'D': 300000, 'E': 5000, 'F': 60000, 'G': 300 },
                    'Charged Off': { 'A': 2000, 'B': 40000, 'C': 500000, 'D': 30000, 'E': 50000, 'F': 80000, 'G': 5000 }
                }
            };

            function prosperPortfolioAnalyticsPromise() {
                return $q(function (resolve, reject) {
                    setTimeout(function () {
                        resolve(mockedDataProsper);
                    }, 1000);
                });
            }

            function allPortfolioAnalyticsPromise() {
                return $q(function(resolve, reject) {
                    setTimeout(function() {
                        resolve({
                            lendingClub: mockedDataLC,
                            prosper: mockedDataProsper
                        });
                    }, 1000);
                });
            }

            function totalCurrentBalancePromise() {
                return $q(function(resolve, reject) {
                    setTimeout(function() {
                        resolve(97202.08);
                    }, 1000);
                });
            }

            function lcCurrentBalancePromise() {
                return $q(function(resolve, reject) {
                    setTimeout(function() {
                        resolve(7678.42);
                    }, 1000);
                });
            }

            function prosperCurrentBalancePromise() {
                return $q(function(resolve, reject) {
                    setTimeout(function() {
                        resolve(89603.66);
                    }, 1000);
                });
            }

            /**
             * Real services definitions
             */

            var allPortfolioAnalytics = function() {
                if (allPortfolioAnalyticsPromise) {
                    return allPortfolioAnalyticsPromise;
                } else {
                    allPortfolioAnalyticsPromise = $http.get("/api/portfolio/analytics");
                    return allPortfolioAnalyticsPromise;
                }
            };

            var lCPortfolioAnalytics = function() {
                if (LCPortfolioAnalyticsPromise) {
                    return LCPortfolioAnalyticsPromise;
                } else {
                    LCPortfolioAnalyticsPromise = $http.get("/api/portfolio/analytics/lendingClub");
                    return LCPortfolioAnalyticsPromise;
                }
            };

            var prosperPortfolioAnalytics = function() {
                if (prosperPortfolioAnalyticsPromise) {
                    return prosperPortfolioAnalyticsPromise;
                } else {
                    prosperPortfolioAnalyticsPromise = $http.get("/api/portfolio/analytics/prosper");
                    return prosperPortfolioAnalyticsPromise;
                }
            };

            var totalCurrentBalance = function() {
                if (totalCurrentBalancePromise) {
                    return totalCurrentBalancePromise;
                } else {
                    totalCurrentBalancePromise = $http.get("/api/portfolio/currentBalance");
                    return totalCurrentBalancePromise;
                }
            };

            var lcCurrentBalance = function() {
                if (lcCurrentBalancePromise) {
                    return lcCurrentBalancePromise;
                } else {
                    lcCurrentBalancePromise = $http.get("/api/portfolio/lendingClub/lcCurrentBalance");
                    return lcCurrentBalancePromise;
                }
            };

            var prosperCurrentBalance = function() {
                if (prosperCurrentBalancePromise) {
                    return prosperCurrentBalancePromise;
                } else {
                    prosperCurrentBalancePromise = $http.get("/api/portfolio/lendingClub/prosperCurrentBalance");
                    return prosperCurrentBalancePromise;
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
                allPortfolioAnalytics: allPortfolioAnalytics(),
                LCPortfolioAnalytics: lCPortfolioAnalytics(),
                prosperPortfolioAnalytics: prosperPortfolioAnalytics(),
                totalCurrentBalance: totalCurrentBalance(),
                lcCurrentBalance: lcCurrentBalance(),
                prosperCurrentBalance: prosperCurrentBalance(),
                notesAcquiredTodayByGrade: notesAcquiredTodayByGrade(),
                notesAcquiredTodayByYield: notesAcquiredTodayByYield(),
                notesAcquiredTodayByPurpose: notesAcquiredTodayByPurpose(),
                notesAcquiredThisYearByMonthByGrade: notesAcquiredThisYearByMonthByGrade(),
                notesAcquiredThisYearByMonthByYield: notesAcquiredThisYearByMonthByYield(),
                notesAcquiredThisYearByMonthByPurpose: notesAcquiredThisYearByMonthByPurpose()
            };
        });
})();