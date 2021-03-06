/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
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
            templateUrl: 'assets/app/directives/mySimpleNumberDisplay/my-simple-number-display.html',
            link: function(scope) {
                scope.$watch('diff', function(diff) {
                    scope.ratioLastValue = ((diff / scope.value) * 100).toFixed(2);
                    if (scope.filter == "currency") {
                        scope.displayedValue = $filter('currency')(scope.value);
                    }

                    scope.ratioLastValueNegative = scope.ratioLastValue < 0;
                });
            }
        };
    }
})();
