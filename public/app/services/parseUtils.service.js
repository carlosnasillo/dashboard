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
        .factory('ParseUtilsService', ParseUtilsService);

    ParseUtilsService.$inject = [];

    function ParseUtilsService() {
        var prettifyList = function(uglyList) {
            var prettyRes = "";
            uglyList.map(function (dealer) {
                prettyRes += dealer + ', ';
            });

            return prettyRes.substr(0, prettyRes.length - 2);
        };

        return {
            prettifyList: prettifyList
        };
    }
})();