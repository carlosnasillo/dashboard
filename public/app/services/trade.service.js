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

    TradeService.$inject = ['$http', '$location', '$rootScope'];

    function TradeService($http, $location, $rootScope) {
        var submitTrade = function(rfqId, quoteId, durationInMonths, client, dealer, creditEvents, cdsValue, originator, premium) {
            var element = {
                rfqId: rfqId,
                quoteId: quoteId,
                durationInMonths: durationInMonths,
                client: client,
                dealer: dealer,
                creditEvents: creditEvents,
                cdsValue: cdsValue,
                originator: originator,
                premium: premium
            };
            return $http.post('/api/trades', element);
        };

        var streamTrades = function(onMessage) {
            var currentUser = $rootScope.globals.currentUser.username;
            var wsUri = 'ws://' + $location.host() + ':' + $location.port() + '/api/trades/stream?user=' + currentUser;

            var websocket = new WebSocket(wsUri);

            var onOpen = function() { console.log('== WebSocket Opened =='); };
            var onClose = function() { console.log('== WebSocket Closed =='); };
            var onError = function(evt) { console.log('WebSocket Error :', evt); };

            websocket.onopen = onOpen;
            websocket.onclose = onClose;
            websocket.onmessage = onMessage;
            websocket.onerror = onError;
        };

        var parseTrade = function(strTrade) {
            var trade = JSON.parse(strTrade);

            return {
                id: trade._id.$oid,
                rfqId: trade.rfqId,
                quoteId: trade.quoteId,
                timestamp: trade.timestamp,
                durationInMonths: trade.durationInMonths,
                client: trade.client,
                dealer: trade.dealer,
                creditEvents: prettifyList(trade.creditEvents),
                cdsValue: trade.cdsValue,
                originator: trade.originator,
                premium: trade.premium
            };
        };

        function prettifyList(uglyList) {
            var prettyRes = "";
            uglyList.map(function (dealer) {
                prettyRes += dealer + ', ';
            });

            return prettyRes.substr(0, prettyRes.length - 2);
        }

        return {
            submitTrade: submitTrade,
            streamTrades: streamTrades,
            parseTrade: parseTrade
        };
    }
})();