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


describe('AlertsService', function() {
    var mockSweetAlert,
        alertsService,
        callback,
        mockQuote;

    function expectSweetAlertErrorToHaveBeenCalled(errorMessage) {
        expect(mockSweetAlert.swal).toHaveBeenCalledWith('Oops...', errorMessage, 'error');
    }

    beforeEach(function() {
        module('app');
        module(function($provide) {
            $provide.service('SweetAlert', function() {
                this.swal = jasmine.createSpy('swal');
            });
        });
    });

    beforeEach(inject(function(SweetAlert, AlertsService) {
        mockSweetAlert = SweetAlert;
        alertsService = AlertsService;

        callback = jasmine.createSpy('callback');
        mockQuote = jasmine.any(Object);
    }));

    describe('accept', function() {
        describe('accept.error', function() {
            it('should display an error', function() {
                var errorMessage = jasmine.any(String);

                alertsService.accept.error(mockQuote, callback)({ data: errorMessage });

                expectSweetAlertErrorToHaveBeenCalled(errorMessage);
                expect(callback).toHaveBeenCalledWith(mockQuote);
            });
        });

        describe('accept.success', function() {
            it('should diplay a success message (accept)', function() {
                alertsService.accept.success(mockQuote, callback)();

                expect(mockSweetAlert.swal).toHaveBeenCalledWith('Done !', 'Quote accepted !', 'success');
                expect(callback).toHaveBeenCalledWith(mockQuote);
            });
        });
    });

    describe('order', function() {
        describe('order.error', function() {
            it('should display an error (order)', function() {
                var errorMessage = jasmine.any(String);

                alertsService.order.error(mockQuote, callback)({ data: errorMessage });

                expectSweetAlertErrorToHaveBeenCalled(errorMessage);
                expect(callback).toHaveBeenCalledWith(mockQuote);
            });
        });

        describe('order.success', function() {
            it('should diplay a success message (order)', function() {
                alertsService.order.success(callback);

                expect(mockSweetAlert.swal).toHaveBeenCalledWith('Done !', 'Your order has been placed !', 'success');
                expect(callback).toHaveBeenCalled();
            });
        });
    });

    describe('quote', function() {
        describe('quote.error', function() {
            it('should display an error (quote)', function() {
                var errorMessage = jasmine.any(String);

                alertsService.quote.error(mockQuote, callback)({ data: errorMessage });

                expectSweetAlertErrorToHaveBeenCalled(errorMessage);
                expect(callback).toHaveBeenCalledWith(mockQuote);
            });
        });

        describe('quote.success', function() {
            it('should diplay a success message (quote)', function() {
                alertsService.quote.success(callback);

                expect(mockSweetAlert.swal).toHaveBeenCalledWith('Done !', 'Quote submitted !', 'success');
                expect(callback).toHaveBeenCalled();
            });
        });
    });

    describe('rfq', function() {
        describe('rfq.error', function() {
            it('should display an error (rfq)', function() {
                var errorMessage = jasmine.any(String);

                alertsService.rfq.error(mockQuote, callback)({ data: errorMessage });

                expectSweetAlertErrorToHaveBeenCalled(errorMessage);
                expect(callback).toHaveBeenCalledWith(mockQuote);
            });
        });

        describe('rfq.success', function() {
            it('should diplay a success message (rfq)', function() {
                alertsService.rfq.success(callback);

                expect(mockSweetAlert.swal).toHaveBeenCalledWith('Done !', 'RFQ submitted !', 'success');
                expect(callback).toHaveBeenCalled();
            });
        });
    });
});

