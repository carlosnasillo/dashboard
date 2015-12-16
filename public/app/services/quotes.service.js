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

    QuotesService.$inject = ['$http', '$location'];

    function QuotesService($http, $location) {
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

        var getQuotesByClient = function(currentAccount) {
            return $http.get("/api/quotes/" + currentAccount);
        };

        var wsCallbackPool = {};

        var webSocket = {
            openStream: function(currentAccount) {
                var wsUri = protocol + '://' + $location.host() + ':' + $location.port() + '/api/quotes/stream/' + currentAccount;

                websocket = new WebSocket(wsUri);

                var onOpen = function() { console.log('== Quotes WebSocket Opened =='); };
                var onClose = function() { console.log('== Quotes WebSocket Closed =='); };
                var onError = function(evt) { console.log('Quotes WebSocket Error :', evt); };

                websocket.onopen = onOpen;
                websocket.onclose = onClose;
                websocket.onmessage = function(evt) {
                    $.map(wsCallbackPool, function(callback) {
                        var quoteObj = parseQuote(evt.data);
                        callback(quoteObj);
                    });
                };
                websocket.onerror = onError;
            },
            addCallback: function(name, callback) {
                wsCallbackPool[name] = callback;
            },
            removeCallback: function(name) {
                delete wsCallbackPool[name];
            },
            closeStream: function() {
                websocket.onclose = function () {};
                websocket.close();
                console.log("== Quotes WebSocket Closed ==");
            }
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
                dealer: quote.dealer
            };
        }

        return {
            submitQuote: submitQuote,
            getQuotesByClient: getQuotesByClient,
            webSocket: webSocket
        };
    }
})();