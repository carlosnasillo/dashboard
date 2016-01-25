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
});