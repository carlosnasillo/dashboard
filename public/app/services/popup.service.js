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

    PopupService.$inject = ['RfqService'];

    function PopupService(RfqService) {
        var wsDealerCallback = function(evt) {
            var rfqObject = RfqService.parseRfq(evt.data);
            console.log(rfqObject);
        };

        return {
            wsDealerCallback: wsDealerCallback
        };
    }
})();