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
* Created on 30/11/2015
*/

(function(){
    'use strict';

    angular
        .module('app')
        .directive('myStackedBarGraph', myStackedBarGraph);

    myStackedBarGraph.$inject = [];

    function myStackedBarGraph() {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                identifier: '@',
                columns: '=',
                groups: '=',
                categories: '='
            },
            template: '<div id="{{identifier}}"></div>',
            link: link
        };
    }

    function link(scope, elem) {
        var chart;

        $('.tab').on('click', function() {
            if (chart) {
                scope.$evalAsync(function() { chart.resize(); });
            }
        });

        scope.$watch('columns', function(columns) {
            if ( columns !== undefined ) {
                generateChart(columns);
            }
        });

        function generateChart(columns) {
            chart = c3.generate({
                bindto: '#' + scope.identifier,
                size: {
                    width: elem.width()
                },
                data: {
                    columns: columns,
                    type: 'bar',
                    groups: scope.groups
                },
                axis: {
                    x: {
                        type: 'category',
                        categories: scope.categories
                    }
                },
                tooltip: {
                    grouped: false
                }
            });
        }
    }
})();