/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

/**
 * Created by julienderay on 04/11/2015.
 */

(function () {
    'use strict';

    angular
        .module('app')
        .directive('myLineGraph', myLineGraph);

    /**
     * Temporary directive as we don't know exactly how data are going to look like
     * labels/series will be replaced by a data variable that we'll have to compute (see myBarGraph for full example)
     */

    myLineGraph.$inject = [];

    function myLineGraph() {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                identifier: '@',
                labels: '=',
                series: '='
            },
            template: '<div id="{{identifier}}" class="ct-perfect-fourth"></div>',
            link: link
        };
    }

    function link(scope) {
        scope.$watch('series', function(series) {
            if (series !== undefined ) {
                var lineChart = new Chartist.Line('#' + scope.identifier, {
                    labels: scope.labels,
                    series: series
                }, {
                    fullWidth: true,
                    chartPadding: {
                        right: 40
                    }
                });
            }
        });
    }
})();
