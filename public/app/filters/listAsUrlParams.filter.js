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
* Created on 04/01/2016
*/

(function() {
    'use strict';

    angular
        .module('app')
        .filter('listAsUrlParams', prettifyList);

    prettifyList.$inject = [];

    function prettifyList() {
        return function (uglyList) {
            var prettyRes = "";
            uglyList.forEach(function (elem) {
                prettyRes += elem + '+';
            });

            return prettyRes.substr(0, prettyRes.length - 1);
        };
    }
})();