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
* Created on 22/12/2015
*/

(function() {
    'use strict';

    angular
        .module('app')
        .factory('TimeoutManagerService', TimeoutManagerService);

    TimeoutManagerService.$inject = ['QuotesService', 'GenericStatesService'];

    function TimeoutManagerService(QuotesService, GenericStatesService) {
        function setUpTimeout(object, $scope, cancelFn) {
            var now = moment();
            var newObj = $.extend({},object);
            var deadline = moment(object.timestamp * 1).add(object.timeWindowInMinutes, 'minutes');
            var diff = deadline.diff(now);
            var duration = Math.round(moment.duration(diff).asSeconds());
            var counter = setInterval(function () {
                $scope.$apply(function() {
                    if (newObj.state == QuotesService.states.accepted) {
                        newObj.timeout = 0;
                        clearInterval(counter);
                    }
                    else if (newObj.state == QuotesService.states.cancelled) {
                        newObj.timeout = 0;
                        clearInterval(counter);
                    }
                    else {
                        if (duration > 0) {
                            duration = duration - 1;
                            newObj.timeout = duration;
                        }
                        else {
                            if (cancelFn) cancelFn();
                            newObj.timeout = 0;
                            newObj.state = GenericStatesService.expired;
                            clearInterval(counter);
                        }
                    }
                });
            }, 1000);

            return newObj;
        }

        return {
            setUpTimeout: setUpTimeout
        };
    }
})();