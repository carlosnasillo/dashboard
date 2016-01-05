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

    RfqService.$inject = ['$http'];

    function RfqService($http) {

        var submitRfq = function(duration, creditEvents, counterparty, quoteWindow, cdsValue, client, referenceEntities) {
            var element = {
                durationInMonths: duration,
                creditEvents: creditEvents,
                dealers: counterparty,
                timeWindowInMinutes: quoteWindow,
                cdsValue: cdsValue,
                client: client,
                isValid: true,
                referenceEntities: referenceEntities
            };
            return $http.post('/api/rfqs', element);
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

        return {
            submitRfq: submitRfq,
            getRfqForDealer: getRfqForDealer,
            getRfqForClient: getRfqForClient,
            parseRfq: parseRfq,
            clientWs: clientsWs,
            dealerWs: dealersWs,
            getRfqById: getRfqById
        };
    }
})();