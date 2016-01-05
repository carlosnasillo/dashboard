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
* Created on 22/12/2015
*/

(function() {
    'use strict';

    angular
        .module('app')
        .factory('TimeoutManagerService', TimeoutManagerService);

    TimeoutManagerService.$inject = [];

    function TimeoutManagerService() {
        function setUpTimeout(object, $scope) {
            var now = moment();
            var newObj = $.extend({},object);
            var deadline = moment(object.timestamp * 1).add(object.timeWindowInMinutes, 'minutes');
            var diff = deadline.diff(now);
            var duration = Math.round(moment.duration(diff).asSeconds());
            var counter = setInterval(function () {
                $scope.$apply(function() {
                    if (newObj.timeout == "Accepted") {
                        clearInterval(counter);
                    }
                    else {
                        if (duration > 0) {
                            duration = duration - 1;
                            newObj.timeout = duration;
                        }
                        else {
                            newObj.timeout = "Expired";
                            newObj.expired = true;
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