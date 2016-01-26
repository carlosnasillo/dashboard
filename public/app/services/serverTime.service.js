/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 18/01/2016
*/


(function() {
    "use strict";

    angular
        .module('app')
        .factory('ServerTimeService', ServerTimeService);

    ServerTimeService.$inject = ['$http'];

    function ServerTimeService($http) {
        var getServerTimeMillis = function() {
            return $http.get('/api/serverTime');
        };

        return {
            getServerTimeMillis: getServerTimeMillis
        };
    }
})();