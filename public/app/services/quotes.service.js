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
* Created on 12/12/2015
*/

(function() {
    'use strict';

    angular
        .module('app')
        .factory('QuotesService', QuotesService);

    QuotesService.$inject = ['$http', 'GenericStatesService'];

    function QuotesService($http, GenericStatesService) {

        var submitQuote = function(rfqId, premium, timeWindowInMinutes, client, dealerAccount, dealerUsername, referenceEntities, paymentPeriodicity) {
            return $http.post('/api/quotes', {
                rfqId: rfqId,
                premium: premium,
                timeWindowInMinutes: timeWindowInMinutes,
                client: client,
                dealer: dealerAccount,
                submittedBy: dealerUsername,
                referenceEntities: referenceEntities,
                paymentPeriodicity: paymentPeriodicity
            });
        };

        var getQuotesByClientGroupByRfqId = function(currentAccount) {
            return $http.get("/api/quotes/client/" + currentAccount);
        };

        var getQuotesByDealerGroupByRfqId = function(currentAccount) {
            return $http.get('/api/quotes/dealer/' + currentAccount);
        };

        var setStateCancelled = function(quoteId) {
            return $http.post('/api/quotes/' + quoteId + '/state/cancelled');
        };

        var accept = function(rfqId, quoteId, durationInMonths, clientAccount, clientUsername, dealerAccount, dealerUsername, creditEvents, cdsValue, premium, referenceEntities) {
            var tradeObj = {
                rfqId: rfqId,
                quoteId: quoteId,
                durationInMonths: durationInMonths,
                client: clientAccount,
                dealer: dealerAccount,
                submittedBy: dealerUsername,
                acceptedBy: clientUsername,
                creditEvents: creditEvents,
                cdsValue: cdsValue,
                premium: premium,
                referenceEntities: referenceEntities
            };
            return $http.post('/api/quotes/accept', tradeObj);
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

        var states = {
            accepted: "Accepted",
            cancelled: "Cancelled",
            expired: GenericStatesService.expired,
            outstanding: GenericStatesService.outstanding
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
                submittedBy: quote.submittedBy,
                referenceEntities: quote.referenceEntities,
                state: quote.state
            };
        }

        return {
            submitQuote: submitQuote,
            getQuotesByClientGroupByRfqId: getQuotesByClientGroupByRfqId,
            getQuotesByDealerGroupByRfqId: getQuotesByDealerGroupByRfqId,
            setStateCancelled: setStateCancelled,
            clientWs: clientWs,
            dealerWs: dealerWs,
            states: states,
            accept: accept
        };
    }
})();