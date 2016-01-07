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
        .factory('AlertsService', AlertsService);

    AlertsService.$inject = ['SweetAlert'];

    function AlertsService(SweetAlert) {
        var genericError = function(quote, callback) {
            return function(error) {
                SweetAlert.swal(
                    "Oops...",
                    error.data,
                    "error"
                );
                callback(quote);
            };
        };

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

        var orderSuccess = function(callback) {
            SweetAlert.swal(
                "Done !",
                "Your order has been placed !",
                "success"
            );

            callback();
        };

        var submitQuoteSuccess = function(callback) {
            SweetAlert.swal(
                "Done !",
                "Quote submitted !",
                "success"
            );
            callback();
        };

        var rfqSuccess = function(callback) {
            SweetAlert.swal(
                "Done !",
                "RFQ submitted !",
                "success"
            );
            callback();
        };

        return {
            accept: {
                success: acceptSuccess,
                error: genericError
            },
            order: {
                success: orderSuccess,
                error: genericError
            },
            quote: {
                success: submitQuoteSuccess,
                error: genericError
            },
            rfq: {
                success: rfqSuccess,
                error: genericError
            }
        };
    }
})();