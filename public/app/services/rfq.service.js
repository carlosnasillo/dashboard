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
* Created on 11/12/2015
*/

(function(){
    'use strict';

    angular
        .module('app')
        .factory('RfqService', RfqService);

    RfqService.$inject = ['$http', '$location', 'ParseUtilsService'];

    function RfqService($http, $location, ParseUtilsService) {
        var dealersWebSocket;
        var clientsWebSocket;

        var protocol = ($location.protocol() == "https") ? "wss" : "ws";

        var submitRfq = function(duration, creditEvents, counterparty, quoteWindow, cdsValue, client, referenceEntity, originator) {
            var element = {
                durationInMonths: duration,
                creditEvents: creditEvents,
                dealers: counterparty,
                timeWindowInMinutes: quoteWindow,
                cdsValue: cdsValue,
                client: client,
                isValid: true,
                referenceEntity: referenceEntity,
                originator: originator
            };
            return $http.post('/api/rfqs', element);
        };

        var wsDealersCallbacksPool = {};
        var wsClientsCallbacksPool = {};

        var getRfqById = function(id) {
            return $http.get('/api/rfqs/' + id);
        };

        var getRfqForClient = function(currentAccount) {
            return $http.get('/api/rfqs/client/' + currentAccount);
        };

        var getRfqForDealer = function(currentAccount) {
            return $http.get('/api/rfqs/dealer/' + currentAccount);
        };

        var dealersWs = {
            openStream: function(currentAccount) {
                var wsUri = protocol + '://' + $location.host() + ':' + $location.port() + '/api/rfqs/stream/dealer/' + currentAccount;

                dealersWebSocket = new WebSocket(wsUri);
                var onOpen = function() { console.log('== RFQs for dealers WebSocket Opened =='); };
                var onClose = function() { console.log('== RFQs for dealers WebSocket Closed =='); };
                var onError = function(evt) { console.log('RFQs for dealers WebSocket Error :', evt); };

                dealersWebSocket.onopen = onOpen;
                dealersWebSocket.onclose = onClose;
                dealersWebSocket.onmessage = getMyCallback(wsDealersCallbacksPool);
                dealersWebSocket.onerror = onError;
            },
            addCallback: function(name, callback) {
                wsDealersCallbacksPool[name] = callback;
            },
            removeCallback: function(name) {
                delete wsDealersCallbacksPool[name];
            },
            closeStream: function() {
                dealersWebSocket.onclose = function () {};
                dealersWebSocket.close();
                console.log("== RFQs for dealers WebSocket Closed ==");
            }
        };

        var clientsWs = {
            openStream: function(currentAccount) {
                var wsUri = protocol + '://' + $location.host() + ':' + $location.port() + '/api/rfqs/stream/client/' + currentAccount;

                clientsWebSocket = new WebSocket(wsUri);
                var onOpen = function() { console.log('== RFQs for clients WebSocket Opened =='); };
                var onClose = function() { console.log('== RFQs for clients WebSocket Closed =='); };
                var onError = function(evt) { console.log('RFQs for clients WebSocket Error :', evt); };

                clientsWebSocket.onopen = onOpen;
                clientsWebSocket.onclose = onClose;
                clientsWebSocket.onmessage = getMyCallback(wsClientsCallbacksPool);
                clientsWebSocket.onerror = onError;
            },
            addCallback: function(name, callback) {
                wsClientsCallbacksPool[name] = callback;
            },
            removeCallback: function(name) {
                delete wsClientsCallbacksPool[name];
            },
            closeStream: function() {
                clientsWebSocket.onclose = function () {};
                clientsWebSocket.close();
                console.log("== RFQs for clients WebSocket Closed ==");
            }
        };

        var parseRfq = function(strRfq) {
            var rfq = JSON.parse(strRfq);

            return {
                id: rfq.id,
                timestamp: rfq.timestamp,
                durationInMonths: rfq.durationInMonths,
                client: rfq.client,
                dealers: rfq.dealers,
                prettyDealers: ParseUtilsService.prettifyList(rfq.dealers),
                creditEvents: rfq.creditEvents,
                prettyCreditEvents: ParseUtilsService.prettifyList(rfq.creditEvents),
                timeWindowInMinutes: rfq.timeWindowInMinutes,
                cdsValue: rfq.cdsValue,
                referenceEntity: rfq.referenceEntity,
                originator: rfq.originator
            };
        };

        return {
            submitRfq: submitRfq,
            getRfqForDealer: getRfqForDealer,
            getRfqForClient: getRfqForClient,
            parseRfq: parseRfq,
            clientWs: clientsWs,
            dealerWs: dealersWs,
            getRfqById: getRfqById
        };

        function prepareObject(evt) {
            var rfqObj = parseRfq(evt.data);
            rfqObj.dealers = ParseUtilsService.prettifyList(rfqObj.dealers);
            rfqObj.prettyCreditEvents = ParseUtilsService.prettifyList(rfqObj.creditEvents);
            return rfqObj;
        }

        function getMyCallback(callbacksPool) {
            return function(evt) {
                $.map(callbacksPool, function(callback) {
                    var rfqObj = prepareObject(evt);
                    callback(rfqObj);
                });
            };
        }
    }
})();