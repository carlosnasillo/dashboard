/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 07/01/2016
*/

var LoansBookPage = require('../pages/loansbook.page.js');
var LoginPage = require('../pages/login.page.js');
var IncomingRfqs = require('../pages/incomingRfqs.page.js');
var RfqModalWindow = require('../pages/rfqModalWindow.page.js');
var SubmittedRfqs = require('../pages/submittedRfqs.page.js');
var TradesPage = require('../pages/trades.page.js');

describe('Loans book page tests', function() {
    var loansBookPage;
    var cdsRandomValue;

    it('should have a non empty table', function() {
        loansBookPage = new LoansBookPage();
        loansBookPage.get();

        var rowsLocator = by.css('.ui-grid-row.ng-scope');

        element.all(rowsLocator).then(function(rows) {
            expect(rows.length).toBeGreaterThan(0);
        })
    });

    describe('Modal to send an RFQ', function() {
        var rfqModalWindow;

        it('should have the correct fields', function() {
            rfqModalWindow = new RfqModalWindow();
            rfqModalWindow.get();

            expect(rfqModalWindow.durationInput.isPresent()).toBe(true);
            expect(rfqModalWindow.creditEventInput.isPresent()).toBe(true);
            expect(rfqModalWindow.counterpartyInput.isPresent()).toBe(true);
            expect(rfqModalWindow.quoteWindowInput.isPresent()).toBe(true);
            expect(rfqModalWindow.cdsValueInput.isPresent()).toBe(true);
        });

        it('should have PDX selected by default in counterparty input', function() {
            element(by.id('counterparty_chosen'))
                .all(by.css('.search-choice'))
                .then(function(selectedCounterparties) {
                    expect(selectedCounterparties.length).toBe(1);

                    var counterpartySelectedByDefault = selectedCounterparties[0].element(by.tagName('span'));
                    expect(counterpartySelectedByDefault.getText()).toBe("PDX");
                });
        });

        var successMessage = by.css('.sweet-alert.showSweetAlert.visible');

        it('should be able to send an RFQ', function() {
            cdsRandomValue = (Math.floor(Math.random() * 9999) + 1).toString();

            rfqModalWindow.sendRfq(cdsRandomValue);
            browser.wait(protractor.until.elementLocated(successMessage), 4000, "No success message displayed.");

            expect(element(successMessage).isPresent()).toBe(true);

            var alertMessage = element(successMessage).element(by.css('p[style="display: block;"]'));
            expect(alertMessage.getText()).toBe('RFQ submitted !');

            var confirmBtn = element(successMessage).element(by.css('button.confirm'));
            expect(confirmBtn.isPresent()).toBe(true);
            confirmBtn.click();

            expect(element(successMessage).isPresent()).toBe(false);
        });

        it('should show a popup displaying PDX\'s autoquoting', function() {
            var popupLocator = by.css('.cg-notify-message-template');
            browser.wait(protractor.until.elementLocated(popupLocator), 15000, "No auto-quoting popup displayed.");
            expect(element(popupLocator).isPresent()).toBe(true);

            expect(element(by.binding('quote.dealer')).getText()).toBe('PDX');
        });
    });

    it('should show the new RFQ in Dealer1\'s submitted RFQs\' table', function() {
        var submittedRfqs = new SubmittedRfqs();
        submittedRfqs.get();

        var rowsLocator = by.css('.ui-grid-row.ng-scope');

        element.all(rowsLocator).then(function(rows) {
            expect(rows.length).toBeGreaterThan(0);
            rows[0]
                .all(by.css('.ui-grid-cell.ng-scope.ui-grid-disable-selection'))
                .then(function(cells) {
                    var cdsValue = cells[7];
                    expect(cdsValue.getText()).toBe(cdsRandomValue);
                });
        });
    });

    it('should show the new RFQ in Dealer2\'s incoming RFQ table', function() {
        var loginPage = new LoginPage();
        loginPage.get();
        loginPage.loginDealer2();
        expect(browser.getLocationAbsUrl()).toBe('/dashboard');

        var incomingRfqs = new IncomingRfqs();
        incomingRfqs.get();

        var rowsLocator = by.css('.ui-grid-row.ng-scope');

        element.all(rowsLocator).then(function(rows) {
            expect(rows.length).toBeGreaterThan(0);
            rows[0]
                .all(by.css('.ui-grid-cell.ng-scope.ui-grid-disable-selection'))
                .then(function(cells) {
                    var cdsValue = cells[6];
                    expect(cdsValue.getText()).toBe(cdsRandomValue);
                });
        });
    });
});