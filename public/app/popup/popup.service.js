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
        .factory('PopupService', PopupService);

    PopupService.$inject = ['notify', 'RfqService', 'AlertsService', 'QuoteModalService', 'TimeoutManagerService', 'QuotesService', '$timeout'];

    function PopupService(notify, RfqService, AlertsService, QuoteModalService, TimeoutManagerService, QuotesService, $timeout) {
        var newQuoteCallback = function(childScope, currentUsername) {
            return function(quoteObject) {
                if (quoteObject.state !== QuotesService.states.cancelled && quoteObject.state !== QuotesService.states.accepted) {
                    childScope.accept = function(quote, closeNotification) {
                        quote.loading = true;

                        AlertsService.accept.warning(function(isAccepted) {
                            if (isAccepted) {
                                RfqService.getRfqById(quote.rfqId).success(function(rfq) {
                                    QuotesService.accept(quote.rfqId, quote.id, rfq.durationInMonths, quote.client, currentUsername, quote.dealer, quote.submittedBy, rfq.creditEvents, rfq.cdsValue, quote.premium, quote.referenceEntities)
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
                            }
                        });
                    };
                    $timeout(function() {
                        var notifyObject = notify({scope: childScope, templateUrl: 'assets/app/popup/newQuotePopup.html', position: 'right', duration: '0'});
                        childScope.quote = TimeoutManagerService.setUpTimeout(quoteObject, childScope, notifyObject.close);
                    }, 1000);
                }
            };
        };

        var newRfqCallback = function(childScope) {
            return function(rfqObject) {
                childScope.quote = function(rfq, closeNotification) {
                    QuoteModalService.quoteModal(rfq.referenceEntities, rfq.id, rfq.client, rfq.timeout);
                    closeNotification();
                };

                $timeout(function() {
                    var notifyObject = notify({scope: childScope, templateUrl: 'assets/app/popup/newRfqPopup.html', position: 'right', duration: '0'});
                    childScope.rfq = TimeoutManagerService.setUpTimeout(rfqObject, childScope, notifyObject.close);
                }, 1000);
            };
        };

        return {
            newQuoteCallback: newQuoteCallback,
            newRfqCallback: newRfqCallback
        };
    }
})();