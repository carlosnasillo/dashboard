/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 *
 */

/**
* @author : julienderay
* Created on 22/12/2015
*/

(function() {
    'use strict';

    angular
        .module('app')
        .factory('FormUtilsService', FormUtilsService);

    FormUtilsService.$inject = [];

    function FormUtilsService() {
        var isNumeric = function(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        };

        var isAtLeastOneTrue = function(conditions) {
            if (conditions) {
                if (conditions.length > 0) {
                    return $.map(conditions, function(v) {
                            return v();
                        })
                        .reduce(function(nl1, n) { return nl1 || n; });
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        };

        var isExpired = function(timeout) {
            return !isNumeric(timeout) || timeout <= 0;
        };

        return {
            isNumeric: isNumeric,
            isAtLeastOneTrue: isAtLeastOneTrue,
            isExpired: isExpired
        };
    }
})();