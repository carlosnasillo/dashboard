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
* Created on 15/12/2015
*/

(function() {
    'use strict';

    angular
        .module('app')
        .factory('WebSocketsManager', WebSocketsManager);

    WebSocketsManager.$inject = ['RfqService', 'QuotesService', 'TradeService', '$location', 'PopupService'];

    function WebSocketsManager(RfqService, QuotesService, TradeService, $location, PopupService) {
        var keepAliveTimeouts = [];

        var protocol = ($location.protocol() == "https") ? "wss" : "ws";

        var rfqDealer = webSocketFactory(RfqService.dealerWs.uri, RfqService.dealerWs.name, RfqService.dealerWs.parsingFunction);
        var rfqClient = webSocketFactory(RfqService.clientWs.uri, RfqService.clientWs.name, RfqService.clientWs.parsingFunction);

        var quoteDealer = webSocketFactory(QuotesService.dealerWs.uri, QuotesService.dealerWs.name, QuotesService.dealerWs.parsingFunction);
        var quoteClient = webSocketFactory(QuotesService.clientWs.uri, QuotesService.clientWs.name, QuotesService.clientWs.parsingFunction);

        var trade = webSocketFactory(TradeService.webSocket.uri, TradeService.webSocket.name, TradeService.webSocket.parsingFunction);
        var tradesAnonymised = webSocketFactory(TradeService.webSocketAnonymised.uri, TradeService.webSocketAnonymised.name, TradeService.webSocketAnonymised.parsingFunction);

        var startUp = function(account, callback) {
            startAllWS(account);
            callback();
        };

        var closeAllWS = function() {
            rfqDealer.closeStream();
            rfqClient.closeStream();
            quoteDealer.closeStream();
            quoteClient.closeStream();
            trade.closeStream();
            tradesAnonymised.closeStream();

            for(var i = keepAliveTimeouts.length -1; i >= 0 ; i--){
                clearInterval( keepAliveTimeouts[i] );
                keepAliveTimeouts.splice(i, 1);
            }
        };

        var webSockets = {
            rfq: {
                dealer: rfqDealer,
                client: rfqClient
            },
            quotes: {
                dealer: quoteDealer,
                client: quoteClient
            },
            trades: trade,
            tradesAnonymised: tradesAnonymised
        };

        return {
            webSockets: webSockets,
            startUp: startUp,
            closeAllWS: closeAllWS
        };

        function startAllWS(account) {
            rfqDealer.openStream(account);
            rfqClient.openStream(account);
            quoteDealer.openStream(account);
            quoteClient.openStream(account);
            trade.openStream(account);
            tradesAnonymised.openStream('');
        }

        function webSocketFactory(uri, name, parsingFunction) {
            var webSocketService = {};

            webSocketService.webSocket = null;
            webSocketService.callbacksPool = {};

            webSocketService.openStream = function (currentAccount) {
                var wsUri = protocol + '://' + $location.host() + ':' + $location.port() + uri + currentAccount;

                webSocketService.webSocket = new WebSocket(wsUri);
                var onOpen = function () {
                    console.log('== ' + name + ' WebSocket Opened ==');
                };
                var onClose = function () {
                    console.log('== ' + name + ' WebSocket Closed ==');
                };
                var onError = function (evt) {
                    console.log(name + ' WebSocket Error :', evt);
                };

                keepAliveTimeouts.push(setInterval(function() {
                    webSocketService.webSocket.send(JSON.stringify("Keep alive !"));
                }, 30000));

                webSocketService.webSocket.onopen = onOpen;
                webSocketService.webSocket.onclose = onClose;
                webSocketService.webSocket.onmessage = callAllCallbacks(webSocketService.callbacksPool, parsingFunction);
                webSocketService.webSocket.onerror = onError;
            };

            webSocketService.addCallback = function (name, callback) {
                webSocketService.callbacksPool[name] = callback;
            };

            webSocketService.removeCallback = function (name) {
                delete webSocketService.callbacksPool[name];
            };

            webSocketService.closeStream = function () {
                webSocketService.webSocket.onclose = function () {
                };
                webSocketService.webSocket.close();
                console.log('== ' + name + ' WebSocket Closed ==');
            };

            return webSocketService;
        }

        function callAllCallbacks(callbacksPool, parse) {
            return function(evt) {
                $.map(callbacksPool, function(callback) {
                    var obj = parse(evt.data);
                    callback(obj);
                });
            };
        }
    }
})();