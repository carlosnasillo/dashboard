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

    TradeService.$inject = ['$http', '$location', 'AuthenticationService'];

    function TradeService($http, $location, AuthenticationService) {
        var websocket;
        var currentAccount = AuthenticationService.getCurrentAccount();

        var tradesByAccountPromise;

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

        var getTradesByAccount = function() {
            if (tradesByAccountPromise) {
                return tradesByAccountPromise;
            } else {
                tradesByAccountPromise = $http.get('/api/trades/' + currentAccount);
                return tradesByAccountPromise;
            }
        };

        var closeTradesStream = function() {
            websocket.onclose = function () {};
            websocket.close();
            console.log("== Trades WebSocket Closed ==");
        };

        return {
            submitTrade: submitTrade,
            closeTradesStream: closeTradesStream,
            getTradesByAccount: getTradesByAccount
        };
    }
})();