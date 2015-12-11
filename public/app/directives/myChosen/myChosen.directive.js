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

(function() {
    'use strict';

    angular
        .module('app')
        .directive('myChosen', function() {
            var linker = function(scope, element, attr) {
                // update the select when data is loaded
                scope.$watch(attr.chosen, function(oldVal, newVal) {
                    element.trigger('chosen:updated');
                });

                // update the select when the model changes
                scope.$watch(attr.ngModel, function() {
                    element.trigger('chosen:updated');
                });

                element.chosen();
            };

            return {
                restrict: 'A',
                link: linker
            };
        });
})();