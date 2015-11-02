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

                var colors = {
                    "A": "#d3d3d3",
                    "B": "#bababa",
                    "C": "#79d2c0",
                    "D": "#1ab394",
                    "E": "#e67e22",
                    "F": "#FFE3C7",
                    "G": "#f1c40f"
                };

                var convertedData = $.map(data, function(v, i){
                    return {
                        value: v,
                        label: i,
                        highlight: "#1ab394",
                        color: colors[i]
                    };
                });

                console.log(convertedData);

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
