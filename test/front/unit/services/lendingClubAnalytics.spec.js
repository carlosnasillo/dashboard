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

describe('LendingClubAnalytics', function() {
    var LCAnalytics, httpBackend;

    beforeEach(function() {
        module('app');
    });

    beforeEach(inject(function(lendingClubAnalytics, $httpBackend) {
        httpBackend = $httpBackend;
        LCAnalytics = lendingClubAnalytics;
    }));

    describe('analytics', function() {
        it('should call the API once and store the result', function() {
            var url = '/api/analytics/lendingClub';
            httpBackend.when(url).respond(200, '{}');

            var analyticsPromise1 = LCAnalytics.analytics();
            httpBackend.expectGET(url).respond(200, '{}');
            httpBackend.flush();

            var analyticsPromise2 = LCAnalytics.analytics();

            expect(analyticsPromise1).toBe(analyticsPromise2);
        });
    });
});