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

    RfqService.$inject = ['$http', '$location', 'AuthenticationService'];

    function RfqService($http, $location, AuthenticationService) {
        var websocket;

        var rfqForClientPromise;
        var rfqForDealerPromise;

        var currentAccount = AuthenticationService.getCurrentAccount();

        var submitRfq = function(duration, creditEvents, counterparty, quoteWindow, cdsValue, client, loanId, originator) {
            var element = {
                durationInMonths: duration,
                creditEvents: creditEvents,
                dealers: counterparty,
                timeWindowInMinutes: quoteWindow,
                cdsValue: cdsValue,
                client: client,
                isValid: true,
                loanId: loanId,
                originator: originator
            };
            return $http.post('/api/rfqs', element);
        };

        var getRfqForClient = function() {
            if (rfqForClientPromise) {
                return rfqForClientPromise;
            } else {
                rfqForClientPromise = $http.get('/api/rfqs/client/' + currentAccount);
                return rfqForClientPromise;
            }
        };

        var getRfqForDealer = function() {
            if (rfqForDealerPromise) {
                return rfqForDealerPromise;
            } else {
                rfqForDealerPromise = $http.get('/api/rfqs/dealer/' + currentAccount);
                return rfqForDealerPromise;
            }
        };

        var closeRfqStream = function() {
            websocket.onclose = function () {};
            websocket.close();
            console.log("== RFQs WebSocket Closed ==");
        };

        var parseRfq = function(strRfq) {
            var rfq = JSON.parse(strRfq);

            return {
                id: rfq._id.$oid,
                timestamp: rfq.timestamp,
                duration: rfq.durationInMonths,
                client: rfq.client,
                dealers: rfq.dealers,
                creditEvents: rfq.creditEvents,
                timeWindowInMinutes: rfq.timeWindowInMinutes,
                cdsValue: rfq.cdsValue,
                loanId: rfq.loanId,
                originator: rfq.originator
            };
        };

        return {
            submitRfq: submitRfq,
            getRfqForDealer: getRfqForDealer,
            getRfqForClient: getRfqForClient,
            parseRfq: parseRfq,
            closeRfqStream: closeRfqStream
        };
    }
})();