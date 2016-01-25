/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 25/01/2016
*/

describe('chartUtilsService', function() {
    var chartUtils;

    beforeEach(function() {
        module('app');
    });

    beforeEach(inject(function(chartUtilsService) {
        chartUtils = chartUtilsService;
    }));

    describe('doughnutChartOptions', function() {
        it('should return the good obejct', function() {
            var expectedAnswer = {
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

            expect(chartUtils.doughnutChartOptions).toEqual(expectedAnswer);
        });
    });

    describe('splitObjectInArray', function() {
        it('should create an array out of a object', function() {
            var obj = { a: 'b', c: 'd' };
            var expectedObject = { labels: ['a', 'c'], array: ['b', 'd'] };

            expect(chartUtils.splitObjectInArray(obj)).toEqual(expectedObject);
        });

        it('should work with empty objects', function() {
            expect(chartUtils.splitObjectInArray({})).toEqual({ labels: [], array: []});
        });

        it('should not be disturbed recursive', function() {
            var obj = { a: 'b', c: { d: 'e'} };
            var expectedObject = { labels: ['a', 'c'], array: ['b', { d: 'e'}] };

            expect(chartUtils.splitObjectInArray(obj)).toEqual(expectedObject);
        });
    });

    describe('doubleDoubleToPercents', function() {
        it('should change ";" to "-" and add a % sign', function() {
            var objectIn = { '3.34;25.54': jasmine.any(Object) };
            var expectedReturn = { '3.34-25.54%': jasmine.any(Object) };

            expect(chartUtils.doubleDoubleToPercents(objectIn)).toEqual(expectedReturn);
        });

        it('should not crash if the key is not formed this way', function() {
            var objectIn = { a: jasmine.any(Object) };
            var expectedReturn = { a: jasmine.any(Object) };

            expect(chartUtils.doubleDoubleToPercents(objectIn)).toEqual(expectedReturn);
        });
    });

    describe('moveGradeFromValueToKey', function() {
        it('should return the expected result', function() {
            var inputObj = {
                AZ: { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7 },
                ZD: { A: 8, B: 9, C: 10, D: 11, E: 12, F: 13, G: 14 }
            };
            var expectedResult = {
                A: { AZ: 1, ZD: 8 },
                B: { AZ: 2, ZD: 9 },
                C: { AZ: 3, ZD: 10 },
                D: { AZ: 4, ZD: 11 },
                E: { AZ: 5, ZD: 12 },
                F: { AZ: 6, ZD: 13 },
                G: { AZ: 7, ZD: 14 }
            };

            expect(chartUtils.moveGradeFromValueToKey(inputObj)).toEqual(expectedResult);
        });

        it('should work even if all grades are not present', function() {
            var inputObj = {
                AZ: { A: 1, B: 2, F: 6, G: 7 },
                ZD: { A: 8, B: 9, C: 10, D: 11, E: 12, F: 13, G: 14 }
            };
            var expectedResult = {
                A: { AZ: 1, ZD: 8 },
                B: { AZ: 2, ZD: 9 },
                C: { ZD: 10 },
                D: { ZD: 11 },
                E: { ZD: 12 },
                F: { AZ: 6, ZD: 13 },
                G: { AZ: 7, ZD: 14 }
            };

            expect(chartUtils.moveGradeFromValueToKey(inputObj)).toEqual(expectedResult);
        });
    });
});