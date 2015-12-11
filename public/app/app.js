/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngCookies', 'ngResource', 'ui.grid', 'angular-peity', 'ui.bootstrap', 'oitozero.ngSweetAlert', 'daterangepicker', 'nsPopover'])
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: "assets/app/login/login.html",
                controller: "LoginController",
                controllerAs: 'vm'
            })
            .when('/dashboard', {
                templateUrl: "assets/app/mainDashboard/mainDashboard.html",
                controller: "MainDashboardController",
                controllerAs: 'vm'
            })
            .when('/portfolio', {
                templateUrl: "assets/app/portfolio/portfolio.html",
                controller: "PortfolioController",
                controllerAs: 'vm'
            })
            .when('/analytics', {
                templateUrl: "assets/app/analytics/analytics.html",
                controller: "AnalyticsController",
                controllerAs: 'vm'
            })
            .when('/loans', {
                templateUrl: "assets/app/loans/loans.html",
                controller: "LoansController",
                controllerAs: 'vm'
            })
            .when('/loanbook', {
                templateUrl: "assets/app/loanbook/loanbook.html",
                controller: "LoanBookController",
                controllerAs: 'vm'
            })
            .otherwise({ redirectTo: '/' });
    }

    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
    function run($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['X-TOKEN'] = $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/');
            }
        });
    }

})();
