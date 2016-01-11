/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 12/01/2016
*/

"use strict";

var LoginPage = require('../pages/login.page.js');
var SubmittedRfqs = require('../pages/submittedRfqs.page.js');
var SuccessModal = require('../pages/success.page.js');
var TradesPage = require('../pages/trades.page.js');
var SdrPage = require('../pages/sdr.page.js');
var IncomingRfqs = require('../pages/incomingRfqs.page.js');

describe('Submitted RFQs tab', function() {
    var loginPage = new LoginPage();
    var submittedRfqs = new SubmittedRfqs();
    var successModal = new SuccessModal();
    var tradesPage = new TradesPage();
    var sdrPage = new SdrPage();
    var incomingRfqsPage = new IncomingRfqs();

    var premiumValue;

    it('should display the new quote as Outstanding', function() {
        loginPage.get();
        loginPage.loginDealer1();

        submittedRfqs.get();
        submittedRfqs.inQuotesTableFirstRow(function(cells) {
            premiumValue = cells[4].getText();
            var stateCell = cells[5];
            expect(stateCell.getText()).toBe('Outstanding');
        });
    });

    it('should be able to accept a quote', function() {
        submittedRfqs.inQuotesTableFirstRow(function(cells) {
            var acceptButtonCell = cells[7];
            var acceptButton = acceptButtonCell.element(by.tagName('button'));

            browser.wait(protractor.ExpectedConditions.elementToBeClickable(acceptButton), 4000)
                .then(function () {
                    expect(acceptButton.getAttribute('disabled')).toBeNull();
                    acceptButton.click();
                });
        });
    });

    it('should display a success message', function() {
        successModal.waitForSuccessMessage();
        expect(successModal.alertMessage.getText()).toBe('Quote accepted !');
        successModal.okBtn.click();
    });

    it('should display the new quote as Accepted', function() {
        submittedRfqs.inQuotesTableFirstRow(function(cells) {
            var stateCell = cells[5];
            expect(stateCell.getText()).toBe('Accepted');
        });
    });

    it('should display the accepted quote in Trades table (client side)', function() {
        tradesPage.get();
        tradesPage.waitForTradesTable();

        tradesPage.inTradesTableFirstRow(function(cells) {
            var premiumValueCell = cells[10];
            var sideCell = cells[1];

            expect(premiumValueCell.getText()).toBe(premiumValue);
            expect(sideCell.getText()).toBe('Buy');
        });
    });

    it('should display the accepted quote in SDR table (Dealer1)', function () {
        checkFirstRowsPremiumValue(premiumValue);
    });

    it('should display the accepted quote in Trades table (dealer side)', function () {
        loginPage.get();
        loginPage.loginDealer2();

        tradesPage.get();

        tradesPage.inTradesTableFirstRow(function(cells) {
            var premiumValueCell = cells[10];
            var sideCell = cells[1];

            expect(premiumValueCell.getText()).toBe(premiumValue);
            expect(sideCell.getText()).toBe('Sell');
        });
    });

    it('should mark the quote as accepted', function() {
        incomingRfqsPage.get();
        incomingRfqsPage.inQuotesTableFirstRow(function(cells) {
            var premiumCell = cells[4];
            var stateCell = cells[5];

            expect(premiumCell.getText()).toBe(premiumValue);
            expect(stateCell.getText()).toBe('Accepted');
        });
    });

    it('should display the accepted quote in SDR table (Dealer2)', function () {
        checkFirstRowsPremiumValue(premiumValue);
    });

    it('should display the accepted quote in SDR table (Dealer3', function() {
        loginPage.get();
        loginPage.loginDealer3();

        checkFirstRowsPremiumValue(premiumValue);
    });

    it('should not display the accepted quote in Dealer3\'s Trades table', function() {
        tradesPage.get();
        browser.wait(protractor.until.elementLocated(tradesPage.rowsLocator), 2000)
            .then(function() {
                tradesPage.inTradesTableFirstRow(function (cells) {
                    var premiumValueCell = cells[10];
                    expect(premiumValueCell.getText()).not.toBe(premiumValue);
                });
            }, function() {});
    });

    function checkFirstRowsPremiumValue(premiumValue) {
        sdrPage.get();

        sdrPage.inTradesTableFirstRow(function (cells) {
            var premiumValueCell = cells[4];
            expect(premiumValueCell.getText()).toBe(premiumValue);
        });
    }
});