/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

/**
 * Created by julienderay on 25/11/2015.
 */

(function() {
    'use strict';

    angular
        .module('app')
        .factory('chartUtilsService', chartUtilsService);

    chartUtilsService.$inject = [];

    function chartUtilsService() {

        var doughnutChartOptions = {
            segmentShowStroke: true,
            segmentStrokeColor: "#fff",
            segmentStrokeWidth: 2,
            percentageInnerCutout: 45,
            animationSteps: 100,
            animationEasing: "easeOutBounce",
            animateRotate: true,
            animateScale: false,
            responsive: true,
            maintainAspectRatio: true
        };

        var splitObjectInArray = function(obj) {
            var labels = Object.keys(obj);
            var array = [];
            $.map(obj, function(v, i) {
                array.push(v);
            });
            return {
                labels: labels,
                array: array
            };
        };

        var doubleDoubleToPercents = function(obj) {
            var objWithAdaptedKeys = {};
            for (var k in obj) {
                if ( obj.hasOwnProperty(k) ) {
                    objWithAdaptedKeys[k.replace(';','-') + "%"] = obj[k];
                }
            }
            return objWithAdaptedKeys;
        };

        var movesGradeFromValueToKey = function(threeDimensionsObj) {
            var invertedData = { 'A':{}, 'B':{}, 'C':{}, 'D':{}, 'E':{}, 'F':{}, 'G':{} };
            $.map(threeDimensionsObj, function(v, i) {
                invertedData.A[i] = v.A;
                invertedData.B[i] = v.B;
                invertedData.C[i] = v.C;
                invertedData.D[i] = v.D;
                invertedData.E[i] = v.E;
                invertedData.F[i] = v.F;
                invertedData.G[i] = v.G;
            });
            return invertedData;
        };

        var mergeObjects = function(obj, accumulator) {
            $.map(obj, function(v, i) {
                if ( accumulator[i] ) {
                    accumulator[i] += v;
                }
                else {
                    accumulator[i] = v;
                }
            });
            return accumulator;
        };

        return {
            doughnutChartOptions: doughnutChartOptions,
            splitObjectInArray: splitObjectInArray,
            doubleDoubleToPercents: doubleDoubleToPercents,
            movesGradeFromValueToKey: movesGradeFromValueToKey,
            mergeObjects: mergeObjects
        };
    }

})();