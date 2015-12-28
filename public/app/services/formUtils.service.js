/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
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
            return !isNaN(parseFloat(n)) && isFinite(n) || n === null;
        };

        var isAtLeastOneTrue = function(conditions) {
            return $.map(conditions, function(v) {
                    return v();
                })
                .reduce(function(nl1, n) { return nl1 || n; });
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