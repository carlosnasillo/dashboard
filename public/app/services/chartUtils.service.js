/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
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
            var array = $.map(obj, function(v, i) {
                return v;
            });
            return {
                labels: labels,
                array: array
            };
        };

        var doubleDoubleToPercents = function(obj) {
            var searchValue = /([0-9]+.[0-9]+);([0-9]+.[0-9]+)/;
            var objWithAdaptedKeys = {};
            for (var k in obj) {
                if ( obj.hasOwnProperty(k) ) {
                    objWithAdaptedKeys[k.replace(searchValue, '$1-$2%')] = obj[k];
                }
            }
            return objWithAdaptedKeys;
        };

        var moveGradeFromValueToKey = function(threeDimensionsObj) {
            var grades = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
            var invertedData = function() {
                var res = {};
                grades.forEach(function(grade) { res[grade] = {}; });
                return res;
            }();
            $.map(threeDimensionsObj, function(v, i) {
                grades.forEach(function(grade) {
                    if (v.hasOwnProperty(grade)) { invertedData[grade][i] = v[grade]; }
                });
            });
            return invertedData;
        };

        var secondDimensionObjToArray = function(threeDimensionObj) {
            var res = {};
            $.map(threeDimensionObj, function(v, i) {
                var objToArray = [];
                $.map(v, function(v) {
                    objToArray.push(v);
                });
                res[i] = objToArray;
            });
            return res;
        };

        var bindFirstAndSecondDimensions = function(threeDimensionObj) {
            var res = [];
            $.map(threeDimensionObj, function(v, i) {
                var secondDim = [];
                secondDim.push(i);
                secondDim = secondDim.concat(v);
                res.push(secondDim);
            });
            return res;
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

        var prefixColumnsName = function(prefix, listArrays) {
            return listArrays.map(function(array) {
                array[0] = prefix + "-" + array[0];
                return array;
            });
        };

        var getColumnsByPrefix = function(completeList, prefixes) {
            var listByPrefix = [];
            prefixes.map(function(prefix) {
                listByPrefix.push( completeList.filter(function(elem) {
                        return elem.indexOf(prefix) > -1;
                    }
                ));
            });

            return listByPrefix;
        };

        var getColorsBySuffix = function(completeList, prefixes) {
            var colors = c3jsDefaultColors;
            var res = {};
            var columnsBySuffix = getColumnsBySuffix(completeList, prefixes);

            for( var i in columnsBySuffix ) {
                if ( columnsBySuffix.hasOwnProperty(i) ) {
                    columnsBySuffix[i].map(setColor);
                }
            }

            function setColor(colName) {
                res[colName] = colors[i % colors.length];
            }

            return res;
        };

        var getSuffix = function(colName) {
            return colName.split('-')[1];
        };

        var fromCamelCaseToTitleCase = function(camelStr) {
            return camelStr
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, function(str){ return str.toUpperCase(); });
        };

        var fromMapToC3StyleData = function(mapObj) {
            return $.map(mapObj, function(v, i) {
                return [[fromCamelCaseToTitleCase(i).trim(), v]];
            });
        };

        var allLettersMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        var c3jsDefaultColors = ["#1F77B4", "#FF7F0E", "#2CA02C", "#D62728", "#9467BD", "#8C564B", "#E377C2"];

        return {
            doughnutChartOptions: doughnutChartOptions,
            splitObjectInArray: splitObjectInArray,
            doubleDoubleToPercents: doubleDoubleToPercents,
            moveGradeFromValueToKey: moveGradeFromValueToKey,
            mergeObjects: mergeObjects,
            secondDimensionObjToArray: secondDimensionObjToArray,
            bindFirstAndSecondDimensions: bindFirstAndSecondDimensions,
            prefixColumnsName: prefixColumnsName,
            getColumnsByPrefix: getColumnsByPrefix,
            getColorsBySuffix: getColorsBySuffix,
            getSuffix: getSuffix,
            fromCamelCaseToTitleCase: fromCamelCaseToTitleCase,
            fromMapToC3StyleData: fromMapToC3StyleData,
            allLettersMonths: allLettersMonths
        };

        function getColumnsBySuffix(completeList, prefixes) {
            var listByPrefix = [];
            prefixes.map(function(prefix) {
                listByPrefix.push( completeList.filter(function(elem) {
                        return elem.indexOf(prefix) > -1;
                    }
                ));
            });

            var first = listByPrefix.pop();

            return first.map(function(v) {
                var suffix = getSuffix(v);
                var brothers = [v];

                listByPrefix.map(function(prefix) {
                    brothers.push(prefix.filter(function(elem) {
                        return getSuffix(elem) === suffix;
                    })[0]);
                });
                return brothers;
            });
        }
    }

})();