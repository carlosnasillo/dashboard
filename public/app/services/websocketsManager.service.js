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
* Created on 15/12/2015
*/

(function() {
    'use strict';

    angular
        .module('app')
        .factory('WebSocketsManager', WebSocketsManager);

    WebSocketsManager.$inject = ['RfqService', 'QuotesService', 'TradeService'];

    function WebSocketsManager(RfqService, QuotesService, TradeService) {

        var startAllWS = function(account) {
            RfqService.dealerWs.openStream(account);
            RfqService.clientWs.openStream(account);
            QuotesService.dealerWs.openStream(account);
            QuotesService.clientWs.openStream(account);
            TradeService.webSocket.openStream(account);
        };

        var closeAllWS = function() {
            RfqService.dealerWs.closeStream();
            RfqService.clientWs.closeStream();
            QuotesService.dealerWs.closeStream();
            QuotesService.clientWs.closeStream();
            TradeService.webSocket.closeStream();
        };

        var webSockets = {
            rfq: {
                dealer: RfqService.dealerWs,
                client: RfqService.clientWs
            },
            quotes: {
                dealer: QuotesService.dealerWs,
                client: QuotesService.clientWs
            },
            trades: TradeService.webSocket
        };

        return {
            webSockets: webSockets,
            startAllWS: startAllWS,
            closeAllWS: closeAllWS
        };
    }
})();