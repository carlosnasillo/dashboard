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
* Created on 11/12/2015
*/

(function(){
    'use strict';

    angular
        .module('app')
        .factory('RfqService', RfqService);

    RfqService.$inject = ['$http', 'GenericStatesService'];

    function RfqService($http, GenericStatesService) {

        var submitRfq = function(duration, creditEvents, counterparty, quoteWindow, cdsValue, clientAccount, clientUsername, referenceEntities) {
            return $http.post('/api/rfqs', {
                durationInMonths: duration,
                creditEvents: creditEvents,
                dealers: counterparty,
                timeWindowInMinutes: quoteWindow,
                cdsValue: cdsValue,
                client: clientAccount,
                submittedBy: clientUsername,
                isValid: true,
                referenceEntities: referenceEntities
            });
        };

        var getRfqById = function(id) {
            return $http.get('/api/rfqs/' + id);
        };

        var getRfqForClient = function(currentAccount) {
            return $http.get('/api/rfqs/client/' + currentAccount);
        };

        var getRfqForDealer = function(currentAccount) {
            return $http.get('/api/rfqs/dealer/' + currentAccount);
        };

        var parseRfq = function(strRfq) {
            var rfq = JSON.parse(strRfq);

            return {
                id: rfq.id,
                timestamp: rfq.timestamp,
                durationInMonths: rfq.durationInMonths,
                client: rfq.client,
                dealers: rfq.dealers,
                submittedBy: rfq.submittedBy,
                creditEvents: rfq.creditEvents,
                timeWindowInMinutes: rfq.timeWindowInMinutes,
                cdsValue: rfq.cdsValue,
                referenceEntities: rfq.referenceEntities
            };
        };

        var dealersWs = {
            uri: '/api/rfqs/stream/dealer/',
            name: 'RFQs for dealers',
            parsingFunction: parseRfq
        };

        var clientsWs = {
            uri: '/api/rfqs/stream/client/',
            name: 'RFQs for clients',
            parsingFunction: parseRfq
        };

        var states = {
            expired: GenericStatesService.expired,
            outstanding: GenericStatesService.outstanding
        };

        return {
            submitRfq: submitRfq,
            getRfqForDealer: getRfqForDealer,
            getRfqForClient: getRfqForClient,
            parseRfq: parseRfq,
            clientWs: clientsWs,
            dealerWs: dealersWs,
            getRfqById: getRfqById,
            states: states
        };
    }
})();