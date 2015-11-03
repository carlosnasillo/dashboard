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
            template: '<canvas id="{{identifier}}"></canvas>',
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
                        value: v,
                        label: i,
                        highlight: "#1ab394",
                        color: colors[colorId++]
                    };
                });

                var chartOptions = {
                    segmentShowStroke: true,
                    segmentStrokeColor: "#fff",
                    segmentStrokeWidth: 2,
                    percentageInnerCutout: 0,
                    animationSteps: 100,
                    animationEasing: "easeOutBounce",
                    animateRotate: true,
                    animateScale: false,
                    responsive: true
                };

                var ctx = $( '#' + scope.identifier ).get(0).getContext("2d");
                var myPieChart = new Chart(ctx).Pie(convertedData, chartOptions);
            }
        });
    }
})();
