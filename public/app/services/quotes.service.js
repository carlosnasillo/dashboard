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

    QuotesService.$inject = ['$http', '$location', 'AuthenticationService'];

    function QuotesService($http, $location, AuthenticationService) {
        var websocket;
        var protocol = ($location.protocol() == "https") ? "wss" : "ws";

        var submitQuote = function(rfqId, premium, timeWindowInMinutes, client, dealer) {
            var element = {
                rfqId: rfqId,
                premium: premium,
                timeWindowInMinutes: timeWindowInMinutes,
                client: client,
                dealer: dealer
           };

            return $http.post('/api/quotes', element);
        };

        var getQuotesByClient = function() {
            var currentAccount = AuthenticationService.getCurrentAccount();
            return $http.get("/api/quotes/" + currentAccount);
        };

        var streamQuotes = function(onMessage) {
            var currentAccount = AuthenticationService.getCurrentAccount();
            var wsUri = protocol + '://' + $location.host() + ':' + $location.port() + '/api/quotes/stream/' + currentAccount;

            websocket = new WebSocket(wsUri);

            var onOpen = function() { console.log('== WebSocket Opened =='); };
            var onClose = function() { console.log('== WebSocket Closed =='); };
            var onError = function(evt) { console.log('WebSocket Error :', evt); };

            websocket.onopen = onOpen;
            websocket.onclose = onClose;
            websocket.onmessage = onMessage;
            websocket.onerror = onError;
        };

        var parseQuote = function(strQuote) {
            var quote = JSON.parse(strQuote);

            return {
                id: quote.id,
                rfqId: quote.rfqId,
                timestamp: quote.timestamp,
                premium: quote.premium,
                timeWindowInMinutes: quote.timeWindowInMinutes,
                client: quote.client,
                dealer: quote.dealer
            };
        };

        var closeQuotesStream = function() {
            websocket.onclose = function () {};
            websocket.close();
            console.log("== Quotes WebSocket Closed ==");
        };

        return {
            submitQuote: submitQuote,
            getQuotesByClient: getQuotesByClient,
            parseQuote: parseQuote,
            streamQuotes: streamQuotes,
            closeQuotesStream: closeQuotesStream
        };
    }
})();