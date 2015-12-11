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

    RfqService.$inject = ['$http', '$location', '$rootScope'];

    function RfqService($http, $location, $rootScope) {
        var submitRfq = function(duration, creditEvents, counterparty, quoteWindow, cdsValue, client) {
            var element = {
                durationInMonths: duration,
                creditEvents: creditEvents,
                dealers: counterparty,
                timeWindowInMinutes: quoteWindow,
                cdsValue: cdsValue,
                client: client,
                isValid: true
            };
            return $http.post('/api/rfqs', element);
        };

        var streamRfq = function(onMessage) {
            var currentUser = $rootScope.globals.currentUser.username;
            var wsUri = 'ws://' + $location.host() + ':' + $location.port() + '/api/rfqs/stream?client=' + currentUser;

            var websocket = new WebSocket(wsUri);

            var onOpen = function() { console.log('== WebSocket Opened =='); };
            var onClose = function() { console.log('== WebSocket Closed =='); };
            var onError = function(evt) { console.log('WebSocket Error :', evt); };

            websocket.onopen = onOpen;
            websocket.onclose = onClose;
            websocket.onmessage = onMessage;
            websocket.onerror = onError;
        };

        var parseRfq = function(strRfq) {
            var rfq = JSON.parse(strRfq);

            return {
                timestamp: rfq.timestamp,
                duration: rfq.durationInMonths,
                client: rfq.client,
                dealers: rfq.dealers,
                creditEvents: rfq.creditEvents,
                timeWindowInMinutes: rfq.timeWindowInMinutes,
                cdsValue: rfq.cdsValue
            };
        };

        return {
            submitRfq: submitRfq,
            streamRfq: streamRfq,
            parseRfq: parseRfq
        };
    }
})();