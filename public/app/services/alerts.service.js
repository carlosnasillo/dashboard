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
        .factory('AlertsService', AlertsService);

    AlertsService.$inject = ['SweetAlert'];

    function AlertsService(SweetAlert) {
        var acceptSuccess = function(quote, callback) {
            return function() {
                SweetAlert.swal(
                    "Done !",
                    "Quote accepted !",
                    "success"
                );
                callback(quote);
            };
        };

        var acceptError = function(quote, callback) {
            return function() {
                SweetAlert.swal(
                    "Oops...",
                    "Something went wrong !",
                    "error"
                );
                callback(quote);
            };
        };

        return {
            accept: {
                success: acceptSuccess,
                error: acceptError
            }
        };
    }
})();