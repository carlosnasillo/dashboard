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

    mySimpleNumberDisplay.$inject = [];

    function mySimpleNumberDisplay() {
        return {
            restrict: 'E',
            scope: {
                title: '@boxTitle',
                value: '@boxValue',
                legend: '@legend',
                day: '@day',
                lastValue: '@lastValue'
            },
            templateUrl: 'view/mySimpleNumberDisplay'
        };
    }
})();