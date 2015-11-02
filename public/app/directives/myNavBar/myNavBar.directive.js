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
        .directive('myNavBar', myNavBar);

    myNavBar.$inject = ['$location', 'AuthenticationService'];

    function myNavBar($location, AuthenticationService) {
        return {
            restrict: 'E',
            scope: {
                active: "@"
            },
            templateUrl: 'view/myNavBar',
            link: function(scope) {
                scope.username = AuthenticationService.GetCurrentUsername();

                scope.logout = function() {
                    AuthenticationService.ClearCredentials();
                    $location.path('/');
                };
            }
        };
    }
})();
