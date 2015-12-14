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

        var websocket;
        var streamQuotes = function(onMessage) {
            var currentAccount = AuthenticationService.getCurrentAccount();
            var protocol = ($location.protocol() == "https") ? "wss" : "ws";

            var wsUri = protocol + '://' + $location.host() + ':' + $location.port() + '/api/quotes/stream?client=' + currentAccount;

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
                id: quote._id.$oid,
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
            streamQuotes: streamQuotes,
            parseQuote: parseQuote,
            closeQuotesStream: closeQuotesStream
        };
    }
})();