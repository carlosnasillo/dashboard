/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 11/01/2016
*/

"use strict";

var IncomingRfqs = require('../pages/incomingRfqs.page.js');
var SuccessModal = require('../pages/success.page.js');
var LoginPage = require('../pages/login.page.js');
var SubmittedRfqs = require('../pages/submittedRfqs.page.js');

describe('Incoming RFQs tab', function() {
    var incomingRfqs = new IncomingRfqs();
    var successModal = new SuccessModal();
    var loginPage = new LoginPage();
    var submittedRfqs = new SubmittedRfqs();

    var premiumValue;

    it('should not have quotes related to the first RFQ of the table', function() {
        loginPage.get();
        loginPage.loginDealer2();

        incomingRfqs.get();
        incomingRfqs.runThroughRfqsTable(function(rfqsRows) {
            rfqsRows[0].click();

            incomingRfqs.runThroughQuotesTable(function(quotesRows) {
                expect(quotesRows.length).toBe(0);
            });
        });
    });

    it('should be able to quote an RFQ', function() {
        premiumValue = (Math.floor(Math.random() * 9999) + 1).toString();

        incomingRfqs.displayModalFirstRow();

        var title = incomingRfqs.modalElement.element(by.tagName('h4')).getText();
        expect(title).toBe('Quote');

        expect(element(successModal.modalElement).isPresent()).toBe(false);

        incomingRfqs.submitQuote(premiumValue);

        successModal.waitForSuccessMessage();

        expect(element(successModal.modalElement).isPresent()).toBe(true);
        expect(successModal.alertMessage.getText()).toBe('Quote submitted !');
    });

    it('should have one quote related th the first RFQ of the table', function() {
        incomingRfqs.runThroughQuotesTable(function(quotesRows) {
            expect(quotesRows.length).toBe(1);
        });
    });

    it('should display the new quotes (from PDX and Dealer2) in Dealer1\'s quotes table in Submitted RFQs tab', function() {
        loginPage.get();
        loginPage.loginDealer1();

        submittedRfqs.get();
        submittedRfqs.runThroughRfqsTable(function(rfqsRows) {
            rfqsRows[0].click();

            submittedRfqs.runThroughQuotesTable(function(quotesRows) {
                expect(quotesRows.length).toBe(2);
            });

            submittedRfqs.inQuotesTableFirstRow(function(cells) {
                var premiumValueCell = cells[4];
                expect(premiumValueCell.getText()).toBe(premiumValue);
            });
        });
    });
});