/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 21/01/2016
*/

describe('FormUtilsService', function() {

    var formUtilsService;

    beforeEach(function() {
        module('app');
    });

    beforeEach(inject(function(FormUtilsService) {
        formUtilsService = FormUtilsService;
    }));

    describe('isNumeric', function() {
        it('should be numeric', function() {
            expect(formUtilsService.isNumeric(1)).toBeTruthy();
            expect(formUtilsService.isNumeric("1")).toBeTruthy();
        });

        it('should not be numeric', function() {
            expect(formUtilsService.isNumeric("kjd")).toBeFalsy();
            expect(formUtilsService.isNumeric(true)).toBeFalsy();
            expect(formUtilsService.isNumeric({})).toBeFalsy();
            expect(formUtilsService.isNumeric(function() {})).toBeFalsy();
            expect(formUtilsService.isNumeric([])).toBeFalsy();
            expect(formUtilsService.isNumeric(null)).toBeFalsy();
            expect(formUtilsService.isNumeric(undefined)).toBeFalsy();
        });
    });

    describe('isAtLeastOneTrue', function() {
        it('should have at least one function returning true', function() {
            var conditions = [
                function() { return true; },
                function() { return false; },
                function() { return false; }
            ];

            var oneCondition = [
                function() { return true; }
            ];

            expect(formUtilsService.isAtLeastOneTrue(conditions)).toBeTruthy();
            expect(formUtilsService.isAtLeastOneTrue(oneCondition)).toBeTruthy();
        });

        it('should have no function returning true', function() {
            var conditions = [
                function() { return false; },
                function() { return false; },
                function() { return false; }
            ];

            var oneCondition = [
                function() { return false; }
            ];

            expect(formUtilsService.isAtLeastOneTrue([])).toBeFalsy();
            expect(formUtilsService.isAtLeastOneTrue(conditions)).toBeFalsy();
            expect(formUtilsService.isAtLeastOneTrue(oneCondition)).toBeFalsy();
        });
    });

    describe('isExpired', function() {
        it('should be expired', function() {
            expect(formUtilsService.isExpired(0)).toBeTruthy();
            expect(formUtilsService.isExpired("")).toBeTruthy();
            expect(formUtilsService.isExpired({})).toBeTruthy();
            expect(formUtilsService.isExpired([])).toBeTruthy();
            expect(formUtilsService.isExpired(undefined)).toBeTruthy();
            expect(formUtilsService.isExpired(null)).toBeTruthy();
            expect(formUtilsService.isExpired(function() {})).toBeTruthy();
        });

        it('should not be expired', function() {
            expect(formUtilsService.isExpired(1)).toBeFalsy();
            expect(formUtilsService.isExpired("1")).toBeFalsy();
        });
    });
});