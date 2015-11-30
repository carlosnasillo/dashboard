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
* Created on 26/11/2015
*/

(function(){
    'use strict';

    angular
        .module('app')
        .directive('myStackedMultiBarGraph', myStackedMultiBarGraph);

    myStackedMultiBarGraph.$inject = [];

    function myStackedMultiBarGraph() {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                identifier: '@',
                data: '='
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

        scope.$watch('data', function(data) {
            if ( data !== undefined ) {
                generateChart(data);
            }
        });

        function generateChart(data) {
            chart = c3.generate({
                bindto: '#' + scope.identifier,
                size: {
                    width: elem.width()
                },
                data: {
                    columns: data.data,
                    type: 'bar',
                    groups: data.groups,
                    colors: data.colors,
                    names: data.names
                },
                axis: {
                    x: {
                        type: 'category',
                        categories: data.categories
                    }
                },
                tooltip: {
                    grouped: false
                },
                legend: {
                    hide: data.hide
                }
            });
        }
    }
})();