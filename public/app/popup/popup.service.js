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
        .factory('PopupService', PopupService);

    PopupService.$inject = ['notify', 'TradeService', 'RfqService', 'AlertsService', 'QuoteModalService', 'TimeoutManagerService'];

    function PopupService(notify, TradeService, RfqService, AlertsService, QuoteModalService, TimeoutManagerService) {
        var newQuoteCallback = function(childScope) {
            return function(quoteObject) {
                childScope.quote = TimeoutManagerService.setUpTimeout(quoteObject);
                childScope.accept = function(quote, closeNotification) {
                    quote.loading = true;

                    RfqService.getRfqById(quote.rfqId).success(function(rfq) {
                        TradeService.submitTrade(quote.rfqId, quote.id, rfq.durationInMonths, quote.client, quote.dealer, rfq.creditEvents, rfq.cdsValue, rfq.originator, quote.premium, quote.referenceEntities)
                            .then(
                                AlertsService.accept.success(quote, function(quote) {
                                    quote.loading = false;
                                    closeNotification();
                                }),
                                AlertsService.accept.error(quote, function(quote) {
                                    quote.loading = false;
                                    closeNotification();
                                })
                            );
                    });
                };

                notify({scope: childScope, templateUrl: 'assets/app/popup/newQuotePopup.html', position: 'right', duration: '10000'});
            };
        };

        var newRfqCallback = function(childScope) {
            return function(rfqObject) {
                childScope.rfq = TimeoutManagerService.setUpTimeout(rfqObject);
                childScope.quote = function(rfq, closeNotification) {
                    QuoteModalService.quoteModal(rfq.referenceEntities, rfq.originator, rfq.id, rfq.client, rfq.timeout);
                    closeNotification();
                };

                notify({scope: childScope, templateUrl: 'assets/app/popup/newRfqPopup.html', position: 'right', duration: '10000'});
            };
        };

        return {
            newQuoteCallback: newQuoteCallback,
            newRfqCallback: newRfqCallback
        };
    }
})();