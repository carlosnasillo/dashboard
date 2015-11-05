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
        .directive('myBarGraph', myBarGraph);

    myBarGraph.$inject = [];

    function myBarGraph() {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                identifier: '@',
                data: '='
            },
            template: '<div id="{{identifier}}" class="ct-chart ct-perfect-fourth"></div>',
            link: link
        };
    }

    //  Legend should be added but only exists as plugin for Chartist.js : https://github.com/CodeYellowBV/chartist-plugin-legend
    function link(scope) {
        scope.$watch('data', function(data) {
            if (data !== undefined ) {

                var convertedData = function(brutData) {
                    var res = [];
                    for (var grade in brutData) {
                        var tmpArray = [];
                        for (var key in brutData[grade]) {
                            tmpArray.push(brutData[grade][key]);
                        }
                        res.push(tmpArray);
                    }
                    return res;
                };

                var barChart = new Chartist.Bar('#' + scope.identifier, {
                    labels: Object.keys(data[Object.keys(data)[0]]),
                    series: convertedData(data)
                }, {
                    stackBars: true,
                    axisY: {
                        labelInterpolationFnc: function (value) {
                            return (value / 100000) + 'k';
                        }
                    }
                });

                barChart.on('draw', function (data) {
                    if (data.type === 'bar') {
                        data.element.attr({
                            style: 'stroke-width: 30px'
                        });
                    }
                });

            }
        });
    }
})();
