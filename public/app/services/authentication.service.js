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
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$cookieStore', '$rootScope', 'WebSocketsManager', 'PopupService'];
    function AuthenticationService($http, $cookieStore, $rootScope, WebSocketsManager, PopupService) {
        var service = {};

        service.login = login;
        service.setCredentials = setCredentials;
        service.clearCredentials = clearCredentials;
        service.getCurrentUsername = getCurrentUsername;
        service.getCurrentAccount = getCurrentAccount;
        service.logout = logout;

        return service;

        function login(username, password, successCallback, errorCallback) {
            $http
                .post('/api/authenticate', { email: username, password: password })
                .then(successCallback, errorCallback);
        }

        function setCredentials(username, token, account) {
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: token,
                    account: account
                }
            };

            $http.defaults.headers.common['X-TOKEN'] = $rootScope.globals.currentUser.authdata; // jshint ignore:line
            $cookieStore.put('globals', $rootScope.globals);

            WebSocketsManager.startUp($rootScope.globals.currentUser.account, function() {
                WebSocketsManager.webSockets.quotes.client.addCallback('quotePopup', PopupService.newQuoteCallback($rootScope.$new(), getCurrentUsername()));
                WebSocketsManager.webSockets.rfq.dealer.addCallback('rfqPopup', PopupService.newRfqCallback($rootScope.$new()));
            });
        }

        function logout() {
            clearCredentials();
            WebSocketsManager.closeAllWS();
        }

        function clearCredentials() {
            $rootScope.globals = {};
            $http.defaults.headers.common['X-TOKEN'] = "";
            $cookieStore.remove('globals');
        }

        function getCurrentUsername() {
            return $rootScope.globals.currentUser.username;
        }

        function getCurrentAccount() {
            return $rootScope.globals.currentUser.account;
        }
    }
})();