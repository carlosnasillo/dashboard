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