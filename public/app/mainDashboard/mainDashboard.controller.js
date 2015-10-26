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

    MainDashboardController.$inject = ['$resource', '$location', 'AuthenticationService'];

    function MainDashboardController($resource, $location, AuthenticationService) {
        var vm = this;
        vm.logout = function() {
            AuthenticationService.ClearCredentials();
            $location.path('/');

        };

        var Analytics = $resource("api/analytics"); // a RESTful-capable resource object
        vm.analytics = Analytics.query(); // for the list of analytics in public/html/mainDashboard.html
    }
})();