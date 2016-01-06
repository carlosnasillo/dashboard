/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 */

/**
* @author : julienderay
* Created on 05/01/2016
*/

(function() {
    'use strict';

    angular
        .module('app')
        .factory('GenericStatesService', GenericStatesService);

    GenericStatesService.$inject = [];

    function GenericStatesService() {
        return {
            expired: "Expired",
            outstanding: "Outstanding"
        };
    }
})();