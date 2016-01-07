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