/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 *
 */

(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngCookies', 'ngResource', 'ui.grid', 'ui.grid.selection', 'ui.grid.autoResize', 'angular-peity', 'ui.bootstrap', 'oitozero.ngSweetAlert', 'daterangepicker', 'nsPopover', 'cgNotify'])
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
            .when('/rfqs', {
                templateUrl: "assets/app/rfqs/rfqs.html",
                controller: "RFQsController",
                controllerAs: 'vm'
            })
            .when('/loanbook/:loansId?', {
                templateUrl: "assets/app/loanbook/loanbook.html",
                controller: "LoanBookController",
                controllerAs: 'vm'
            })
            .when('/quotes', {
                templateUrl: "assets/app/incomingRfqs/incomingRfqs.html",
                controller: "IncomingRfqsController",
                controllerAs: 'vm'
            })
            .when('/trades', {
                templateUrl: "assets/app/trades/trades.html",
                controller: "TradesController",
                controllerAs: 'vm'
            })
            .when('/sdr', {
                templateUrl: "assets/app/sdr/sdr.html",
                controller: "SdrController",
                controllerAs: 'vm'
            })
            .otherwise({ redirectTo: '/dashboard' });
    }

    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http', 'WebSocketsManager', 'PopupService', 'ServerTimeService'];
    function run($rootScope, $location, $cookieStore, $http, WebSocketsManager, PopupService, ServerTimeService) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};

        function authorizedPage() { return $.inArray($location.path(), ['', '/']) > -1; }

        if ($rootScope.globals.currentUser && !authorizedPage()) {
            $http.defaults.headers.common['X-TOKEN'] = $rootScope.globals.currentUser.authdata; // jshint ignore:line
            WebSocketsManager.startUp($rootScope.globals.currentUser.account, function() {
                WebSocketsManager.webSockets.quotes.client.addCallback('quotePopup', PopupService.newQuoteCallback($rootScope.$new(), $rootScope.globals.currentUser.username));
                WebSocketsManager.webSockets.rfq.dealer.addCallback('rfqPopup', PopupService.newRfqCallback($rootScope.$new()));
            });
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var loggedIn = $rootScope.globals.currentUser;
            if (!authorizedPage() && (!loggedIn || loggedIn === undefined)) {
                $location.path('/');
            }
        });

        ServerTimeService.getServerTimeMillis().then(function(serverTimeMillis) {
            $rootScope.millisDiffWithServer = serverTimeMillis.data - moment().valueOf();
        });
    }
})();
