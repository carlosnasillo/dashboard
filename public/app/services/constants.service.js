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
* Created on 31/12/2015
*/

(function(){
    'use strict';

    angular
        .module('app')
        .service('Constants', Constants);

    Constants.$inject = [];

    function Constants() {
        return {
            automaticDealer: "Lattice"
        };
    }
})();