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
        .controller('MainDashboardController', MainDashboardController);

    MainDashboardController.$inject = ['$location', 'AuthenticationService', 'lendingClubAnalytics'];

    function MainDashboardController($location, AuthenticationService, lendingClubAnalytics) {
        var vm = this;
        vm.logout = function() {
            AuthenticationService.ClearCredentials();
            $location.path('/');

        };

        vm.minimizeSidebar = function() {
            $("body").toggleClass("mini-navbar");
            SmoothlyMenu();
        };

        vm.username = AuthenticationService.GetCurrentUsername();

        lendingClubAnalytics().success(function(data) {
            vm.analytics = data;
        });
    }
})();