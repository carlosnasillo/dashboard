/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 22/01/2016
*/

(function() {
    "use strict";

    angular
        .module('app')
        .factory('UtilsService', UtilsService);

    UtilsService.$inject = [];

    function UtilsService() {

        var getProperty = function(obj, prop) {
            var parts = prop.split('.');

            if (Array.isArray(parts)) {
                var last = parts.pop(),
                    l = parts.length,
                    i = 1,
                    current = parts[0];

                while (l > 0 && (obj = obj[current]) && i < l) {
                    current = parts[i];
                    i++;
                }

                return obj ? obj[last] : undefined;
            } else {
                throw 'parts is not valid array';
            }
        };

        var stringStartsWith = function(string, prefix) {
            return String(string).slice(0, String(prefix).length) == prefix;
        };

        return {
            getProperty: getProperty,
            stringStartsWith: stringStartsWith
        };
    }
})();