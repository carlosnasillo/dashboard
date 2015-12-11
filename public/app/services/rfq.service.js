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
* Created on 11/12/2015
*/

(function(){
    'use strict';

    angular
        .module('app')
        .factory('RfqService', RfqService);

    RfqService.$inject = ['$http'];

    function RfqService($http) {
        var submitRfq = function(duration, creditEvent, counterparty, quoteWindow, cdsValue, client) {
            var element = {
                durationInMonths: duration,
                creditEvent: creditEvent,
                dealer: counterparty,
                timeWindowInMinutes: quoteWindow,
                cdsValue: cdsValue,
                client: client,
                isValid: true
            };
                console.log(element);
            return $http.post('/api/rfq', element);
        };

        return {
            submitRfq: submitRfq
        };
    }
})();