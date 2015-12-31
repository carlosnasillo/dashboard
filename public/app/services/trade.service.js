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

    TradeService.$inject = ['$http', 'ParseUtilsService'];

    function TradeService($http, ParseUtilsService) {

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

        var webSocket = {
            uri: '/api/trades/stream/',
            name: 'Trades',
            parsingFunction: parseTrade
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
                prettyCreditEvents: ParseUtilsService.prettifyList(trade.creditEvents),
                creditEvents: trade.creditEvents,
                cdsValue: trade.cdsValue,
                originator: trade.originator,
                premium: trade.premium,
                referenceEntity: trade.referenceEntity
            };
        }
    }
})();