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

(function () {
    'use strict';

    angular
        .module('app')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$rootScope'];
    function AuthenticationService($http, $rootScope) {
        var service = {};

        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;
        service.GetCurrentUsername = GetCurrentUsername;

        return service;

        function Login(username, password, successCallback, errorCallback) {
            $http
                .post('/api/authenticate', { email: username, password: password })
                .then(successCallback, errorCallback);
        }

        function SetCredentials(username, token) {
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: token
                }
            };

            $http.defaults.headers.common.Authorization = token; // jshint ignore:line
        }

        function ClearCredentials() {
            $rootScope.globals = {};
            $http.defaults.headers.common.Authorization = 'Basic';
        }

        function GetCurrentUsername() {
            return $rootScope.globals.currentUser.username;
        }
    }
})();