/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

/**
 * Created by julienderay on 26/10/2015.
 */

(function () {
    'use strict';

    angular
        .module('app')
        .directive('mySimpleNumberDisplay', mySimpleNumberDisplay);

    mySimpleNumberDisplay.$inject = ['$filter'];

    function mySimpleNumberDisplay($filter) {
        return {
            restrict: 'E',
            scope: {
                title: '@boxTitle',
                value: '=boxValue',
                legend: '@legend',
                day: '@day',
                diff: '=diff',
                filter: '@'
            },
            templateUrl: 'view/mySimpleNumberDisplay',
            link: function(scope) {
                scope.$watch('diff', function(diff) {
                scope.ratioLastValue = ((diff / scope.value) * 100).toFixed(2);
                if (scope.filter == "currency") {
                    scope.value = $filter('currency')(scope.value)
                }

                scope.ratioLastValueNegative = scope.ratioLastValue < 0;
            });
        }
        };
    }
})();
