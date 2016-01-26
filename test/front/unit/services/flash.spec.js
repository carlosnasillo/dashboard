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

describe('FlashService', function() {
    var rootScope,
        flashService,
        mockMessage,
        mockKeepAfterLocationChange;

    beforeEach(function() {
        module('app');
    });

    beforeEach(inject(function($rootScope, FlashService) {
        rootScope = $rootScope;
        flashService = FlashService;

        mockMessage = { data: jasmine.any(String) };
        mockKeepAfterLocationChange = jasmine.any(Boolean);
    }));

    describe('success', function() {
        it('should add a flash message to $rootScope on success', function() {
            flashService.Success(mockMessage, mockKeepAfterLocationChange);

            expect(rootScope.flash).toEqual({
                message: mockMessage.data,
                type: 'success',
                keepAfterLocationChange: mockKeepAfterLocationChange
            });
        });
    });

    describe('error', function() {
        it('should add a flash message to $rootScope on error', function() {
            flashService.Error(mockMessage, mockKeepAfterLocationChange);

            expect(rootScope.flash).toEqual({
                message: mockMessage.data,
                type: 'error',
                keepAfterLocationChange: mockKeepAfterLocationChange
            });
        });
    });

    describe('behavior on location changes', function() {
        it('should remove the message after location change if asked', function() {
            var doNotKeepAfterLocationChange = false;

            flashService.Success(mockMessage, doNotKeepAfterLocationChange);

            rootScope.$broadcast("$locationChangeStart");

            expect(rootScope.flash).toBeUndefined();
        });

        it('should not remove the message after location change if not asked', function() {
            var doNotKeepAfterLocationChange = true;

            flashService.Success(mockMessage, doNotKeepAfterLocationChange);

            rootScope.$broadcast("$locationChangeStart");

            expect(rootScope.flash).not.toBeUndefined();
        });
    });
});