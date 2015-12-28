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

        var wsClientCallbackPool = {};
        var wsDealerCallbackPool = {};

        var clientWs = {
            openStream: function(currentAccount) {
                var wsUri = protocol + '://' + $location.host() + ':' + $location.port() + '/api/quotes/stream/client/' + currentAccount;

                websocket = new WebSocket(wsUri);

                var onOpen = function() { console.log('== Quotes for client WebSocket Opened =='); };
                var onClose = function() { console.log('== Quotes for client WebSocket Closed =='); };
                var onError = function(evt) { console.log('Quotes for client WebSocket Error :', evt); };

                websocket.onopen = onOpen;
                websocket.onclose = onClose;
                websocket.onmessage = getMyCallback(wsClientCallbackPool);
                websocket.onerror = onError;
            },
            addCallback: function(name, callback) {
                wsClientCallbackPool[name] = callback;
            },
            removeCallback: function(name) {
                delete wsClientCallbackPool[name];
            },
            closeStream: function() {
                websocket.onclose = function () {};
                websocket.close();
                console.log("== Quotes for client WebSocket Closed ==");
            }
        };

        var dealerWs = {
            openStream: function(currentAccount) {
                var wsUri = protocol + '://' + $location.host() + ':' + $location.port() + '/api/quotes/stream/dealer/' + currentAccount;

                websocket = new WebSocket(wsUri);

                var onOpen = function() { console.log('== Quotes for dealer WebSocket Opened =='); };
                var onClose = function() { console.log('== Quotes for dealer WebSocket Closed =='); };
                var onError = function(evt) { console.log('Quotes for dealer WebSocket Error :', evt); };

                websocket.onopen = onOpen;
                websocket.onclose = onClose;
                websocket.onmessage = getMyCallback(wsDealerCallbackPool);
                websocket.onerror = onError;
            },
            addCallback: function(name, callback) {
                wsDealerCallbackPool[name] = callback;
            },
            removeCallback: function(name) {
                delete wsDealerCallbackPool[name];
            },
            closeStream: function() {
                websocket.onclose = function () {};
                websocket.close();
                console.log("== Quotes for dealer WebSocket Closed ==");
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

        function getMyCallback(callbacksPool) {
            return function(evt) {
                $.map(callbacksPool, function(callback) {
                    var rfqObject = parseQuote(evt.data);
                    callback(rfqObject);
                });
            };
        }
    }
})();