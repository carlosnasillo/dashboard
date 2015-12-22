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

    PopupService.$inject = ['notify', 'TradeService', 'RfqService', 'AlertsService'];

    function PopupService(notify, TradeService, RfqService, AlertsService) {
        var wsDealerCallback = function(childScope) {
            return function(quoteObject) {
                childScope.quote = setUpTimeout(quoteObject);
                childScope.accept = function(quote, closeMethod) {
                    quote.loading = true;

                    RfqService.getRfqById(quote.rfqId).success(function(rfq) {
                        TradeService.submitTrade(quote.rfqId, quote.id, rfq.durationInMonths, quote.client, quote.dealer, rfq.creditEvents, rfq.cdsValue, rfq.originator, quote.premium)
                            .then(
                                AlertsService.accept.success(quote, function(quote) {
                                    quote.loading = false;
                                    closeMethod();
                                }),
                                AlertsService.accept.error(quote, function(quote) {
                                    quote.loading = false;
                                    closeMethod();
                                })
                            );
                    });
                };

                notify({scope: childScope, templateUrl: 'assets/app/popup/popup.html', position: 'right', duration: '10000'});
            };
        };

        return {
            wsDealerCallback: wsDealerCallback
        };

        function setUpTimeout(object) {
            var now = moment();
            var newObj = $.extend(true,{},object);
            var deadline = moment(object.timestamp).add(object.timeWindowInMinutes, 'minutes');
            var diff = deadline.diff(now);
            var duration = Math.round(moment.duration(diff).asSeconds());
            var counter = setInterval(function () {
                if (duration > 0) {
                    duration = duration - 1;
                    newObj.timeout = duration;
                }
                else {
                    newObj.timeout = "Expired";
                    clearInterval(counter);
                }
            }, 1000);

            return newObj;
        }
    }
})();