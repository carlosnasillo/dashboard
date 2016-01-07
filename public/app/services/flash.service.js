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
        .factory('FlashService', FlashService);

    FlashService.$inject = ['$rootScope'];
    function FlashService($rootScope) {
        var service = {};

        service.Success = flashSuccess;
        service.Error = flashError;

        initService();

        return service;

        function initService() {
            $rootScope.$on('$locationChangeStart', function () {
                clearFlashMessage();
            });

            function clearFlashMessage() {
                var flash = $rootScope.flash;
                if (flash) {
                    if (!flash.keepAfterLocationChange) {
                        delete $rootScope.flash;
                    } else {
                        // only keep for a single location change
                        flash.keepAfterLocationChange = false;
                    }
                }
            }
        }

        function flashSuccess(message, keepAfterLocationChange) {
            $rootScope.flash = {
                message: message.data,
                type: 'success',
                keepAfterLocationChange: keepAfterLocationChange
            };
        }

        function flashError(message, keepAfterLocationChange) {
            $rootScope.flash = {
                message: message.data,
                type: 'error',
                keepAfterLocationChange: keepAfterLocationChange
            };
        }
    }
})();