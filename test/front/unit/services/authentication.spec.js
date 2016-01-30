/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 20/01/2016
*/

var httpBackend, mockWebSocketsManager, mockPopupService, authenticationService;

describe("Authentication service", function() {

    var username = "user1",
        password = "password1",
        token = "xxx-xxx-xxx",
        account = "account1";

    beforeEach(function(){
        module('app');
        module(function($provide){
            $provide.factory('WebSocketsManager', function() {
                return {
                    startUp: jasmine.createSpy('startUp'),
                    closeAllWS: jasmine.createSpy('closeAllWS')
                };
            });
            $provide.factory('PopupService', function() {
                return {
                    newQuoteCallback: jasmine.createSpy('newQuoteCallback'),
                    newRfqCallback: jasmine.createSpy('newRfqCallback')
                };
            });
        });
    });

    beforeEach(inject(function(WebSocketsManager, PopupService, AuthenticationService, $httpBackend){
        mockWebSocketsManager = WebSocketsManager;
        mockPopupService = PopupService;
        authenticationService = AuthenticationService;
        httpBackend = $httpBackend;

        $httpBackend.when('POST', '/api/authenticate').respond();
    }));


    describe('login', function() {
        it("should log the user in", function() {
            var  successCallback = function() {},
                 errorCallback = function() {};

            authenticationService.login(username, password, successCallback, errorCallback);

            httpBackend.expectPOST('/api/authenticate');
            expect(httpBackend.flush).not.toThrow();
        });
    });

    describe('setCredentials', function() {
        it('should set credentials', inject(function($http, $rootScope, $cookieStore) {
            var expectedGlobals = {
                currentUser: {
                    username: username,
                    authdata: token,
                    account: account
                }
            };

            authenticationService.setCredentials(username, token, account);

            expect($rootScope.globals).toEqual(expectedGlobals);
            expect($http.defaults.headers.common['X-TOKEN']).toEqual(token);
            expect($cookieStore.get('globals')).toEqual(expectedGlobals);
            expect(mockWebSocketsManager.startUp).toHaveBeenCalled();
        }));
    });

    describe('logout', function() {
        it('should log the user out', function() {
            spyOn(authenticationService, 'clearCredentials');

            authenticationService.logout();

            expect(authenticationService.clearCredentials).toHaveBeenCalled();
            expect(mockWebSocketsManager.closeAllWS).toHaveBeenCalled();
        });
    });

    describe('clearCredentials', function() {
        it('should clear user\'s credentials', inject(function($rootScope, $http, $cookieStore) {
            authenticationService.clearCredentials();

            expect($rootScope.globals).toEqual({});
            expect($http.defaults.headers.common['X-TOKEN']).toBe("");
            expect($cookieStore.get('globals')).toBeUndefined();
        }));
    });

    describe('getCurrentUsername', function() {
        it('should return current username when a user is connected', function() {
            authenticationService.setCredentials(username, token, account);

            var currentUsername = authenticationService.getCurrentUsername();

            expect(currentUsername).toBe(username);
        });

        it('should return undefined on getCurrentUsername when a user is NOT connected', function() {
            authenticationService.setCredentials(username, token, account);
            authenticationService.logout();

            var currentUsername = authenticationService.getCurrentUsername();

            expect(currentUsername).toBeUndefined();
        });
    });

    describe('getCurrentAccount', function() {
        it('should return current account when a user is connected', function() {
            authenticationService.setCredentials(username, token, account);

            var currentUsername = authenticationService.getCurrentAccount();

            expect(currentUsername).toBe(account);
        });

        it('should return undefined on getCurrentAccount when a user is NOT connected', function() {
            authenticationService.setCredentials(username, token, account);
            authenticationService.logout();

            var currentUsername = authenticationService.getCurrentAccount();

            expect(currentUsername).toBeUndefined();
        });
    });
});