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

        var submitQuote = function(rfqId, premium, timeWindowInMinutes, client, dealer, referenceEntity) {
            var element = {
                rfqId: rfqId,
                premium: premium,
                timeWindowInMinutes: timeWindowInMinutes,
                client: client,
                dealer: dealer,
                referenceEntity: referenceEntity
            };

            return $http.post('/api/quotes', element);
        };

        var getQuotesByClientGroupByRfqId = function(currentAccount) {
            return $http.get("/api/quotes/client/" + currentAccount);
        };

        var getQuotesByDealerGroupByRfqId = function(currentAccount) {
            return $http.get('/api/quotes/dealer/' + currentAccount);
        };

        var clientWs = {
            uri: '/api/quotes/stream/client/',
            name: 'Quotes for client',
            parsingFunction: parseQuote
        };

        var dealerWs = {
            uri: '/api/quotes/stream/dealer/',
            name: 'Quotes for dealer',
            parsingFunction: parseQuote
        };

        function parseQuote(strQuote) {
            var quote = JSON.parse(strQuote);

            return {
                id: quote.id,
                rfqId: quote.rfqId,
                timestamp: quote.timestamp,
                premium: quote.premium,
                timeWindowInMinutes: quote.timeWindowInMinutes,
                client: quote.client,
                dealer: quote.dealer,
                referenceEntity: referenceEntity
            };
        }

        return {
            submitQuote: submitQuote,
            getQuotesByClientGroupByRfqId: getQuotesByClientGroupByRfqId,
            getQuotesByDealerGroupByRfqId: getQuotesByDealerGroupByRfqId,
            clientWs: clientWs,
            dealerWs: dealerWs
        };
    }
})();