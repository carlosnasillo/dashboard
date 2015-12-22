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
* Created on 13/12/2015
*/


(function(){
    'use strict';

    angular
        .module('app')
        .factory('TradeService', TradeService);

    TradeService.$inject = ['$http', '$location', 'ParseUtilsService'];

    function TradeService($http, $location, ParseUtilsService) {
        var websocket;
        var protocol = ($location.protocol() == "https") ? "wss" : "ws";

        var submitTrade = function(rfqId, quoteId, durationInMonths, client, dealer, creditEvents, cdsValue, originator, premium, referenceEntity) {
            var element = {
                rfqId: rfqId,
                quoteId: quoteId,
                durationInMonths: durationInMonths,
                client: client,
                dealer: dealer,
                creditEvents: creditEvents,
                cdsValue: cdsValue,
                originator: originator,
                premium: premium,
                referenceEntity: referenceEntity
            };
            return $http.post('/api/trades', element);
        };

        var getTradesByAccount = function(currentAccount) {
            return $http.get('/api/trades/' + currentAccount);
        };

        var wsCallbackPool = {};

        var webSocket = {
            openStream: function(currentAccount) {
                var wsUri = protocol + '://' + $location.host() + ':' + $location.port() + '/api/trades/stream/' + currentAccount;

                websocket = new WebSocket(wsUri);

                var onOpen = function() { console.log('== Trades WebSocket Opened =='); };
                var onClose = function() { console.log('== Trades WebSocket Closed =='); };
                var onError = function(evt) { console.log('Trades WebSocket Error :', evt); };

                websocket.onopen = onOpen;
                websocket.onclose = onClose;
                websocket.onmessage = function(evt) {
                    $.map(wsCallbackPool, function(callback) {
                        var tradeObj = parseTrade(evt.data);
                        callback(tradeObj);
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
                console.log("== Trades WebSocket Closed ==");
            }
        };

        return {
            submitTrade: submitTrade,
            getTradesByAccount: getTradesByAccount,
            parseTrade: parseTrade,
            webSocket: webSocket
        };

        function parseTrade(strTrade) {
            var trade = JSON.parse(strTrade);

            return {
                id: trade.id,
                rfqId: trade.rfqId,
                quoteId: trade.quoteId,
                timestamp: trade.timestamp,
                durationInMonths: trade.durationInMonths,
                client: trade.client,
                dealer: trade.dealer,
                creditEvents: ParseUtilsService.prettifyList(trade.creditEvents),
                cdsValue: trade.cdsValue,
                originator: trade.originator,
                premium: trade.premium,
                referenceEntity: trade.referenceEntity
            };
        }
    }
})();