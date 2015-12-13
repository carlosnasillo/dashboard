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
* Created on 12/12/2015
*/

(function() {
    'use strict';

    angular
        .module('app')
        .factory('QuotesService', QuotesService);

    QuotesService.$inject = ['$http'];

    function QuotesService($http) {
        var submitQuote = function(rfqId, timestamp, premium, timeWindowInMinutes, client, dealer) {
            var element = {
                rfqId: rfqId,
                timestamp: timestamp,
                premium: premium,
                timeWindowInMinutes: timeWindowInMinutes,
                client: client,
                dealer: dealer
           };

            return $http.post('/api/quotes', element);
        };

        return {
            submitQuote: submitQuote
        };
    }
})();