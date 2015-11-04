/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

/**
 * Created by julienderay on 27/10/2015.
 */

(function () {
    'use strict';

    angular
        .module('app')
        .directive('myPieChart', myPieChart);

    myPieChart.$inject = [];

    function myPieChart() {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                height: '@',
                width: '@',
                identifier: '@',
                data: '='
            },
            template: '<div class="flot-chart"><div class="flot-chart-pie-content" id="{{identifier}}"></div><div class="flot-chart">',
            link: link
        };
    }

    function link(scope) {
        scope.$watch('data', function(data) {
            if (data !== undefined ) {

                var colors = ["#d3d3d3", "#bababa", "#79d2c0", "#1ab394", "#e67e22", "#FFE3C7", "#f1c40f"];

                var colorId = 0;
                var convertedData = $.map(data, function(v, i) {
                    return {
                        data: v,
                        label: i,
                        color: colors[colorId++]
                    };
                });

                var plotObj = $.plot($("#" + scope.identifier), convertedData, {
                    series: {
                        pie: {
                            show: true
                        }
                    },
                    grid: {
                        hoverable: true
                    },
                    tooltip: true,
                    tooltipOpts: {
                        content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
                        shifts: {
                            x: 20,
                            y: 0
                        },
                        defaultTheme: false
                    }
                });
            }
        });
    }
})();
