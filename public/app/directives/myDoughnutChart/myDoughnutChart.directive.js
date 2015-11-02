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
        .directive('myDoughnutChart', myDoughnutChart);

    myDoughnutChart.$inject = [];

    function myDoughnutChart() {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                height: '@',
                width: '@',
                identifier: '@',
                data: '='
            },
            template: '<canvas data-ng-attr-height="height" data-ng-attr-width="width" id="{{identifier}}"></canvas>',
            link: link
        };
    }

    function link(scope) {
        scope.$watch('data', function(data) {
            if (data !== undefined ) {
                var colors = {
                    "A": "#a3e1d4",
                    "B": "#6A3DFF",
                    "C": "#dedede",
                    "D": "#b5b8cf",
                    "E": "#FF26F1",
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

                var ctx = $( '#' + scope.identifier ).get(0).getContext("2d");

                var chartOptions = {
                    segmentShowStroke: true,
                    segmentStrokeColor: "#fff",
                    segmentStrokeWidth: 2,
                    percentageInnerCutout: 45,
                    animationSteps: 100,
                    animationEasing: "easeOutBounce",
                    animateRotate: true,
                    animateScale: false,
                    responsive: true
                };

                var myDoughnutChart = new Chart(ctx).Doughnut(convertedData, chartOptions);
            }
        });
    }
})();
