/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 *
 */

/**
 * Created by julienderay on 26/10/2015.
 */

(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', 'AuthenticationService', 'FlashService'];
    function LoginController($location, AuthenticationService, FlashService) {
        var vm = this;

        vm.dataLoading = false;
        vm.login = login;

        (function initController() {
            // reset login status
            AuthenticationService.clearCredentials();
        })();

        function login() {
            vm.dataLoading = true;
            AuthenticationService.login(
                vm.username,
                vm.password,
                function (response) {
                    AuthenticationService.setCredentials(vm.username, response.data.token, response.data.account);
                    $location.path('/dashboard');
                },
                function (errorResponse) {
                    FlashService.Error(errorResponse);
                    vm.dataLoading = false;
                }
            );
        }
    }
})();
