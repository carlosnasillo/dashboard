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
var SubmittedRfqs = require('../pages/submittedRfqs.page.js');
var SuccessModal = require('../pages/success.page.js');

describe('Loans book page tests', function() {
    var loansBookPage;
    var cdsRandomValue;

    var submittedRfqs = new SubmittedRfqs();

    it('should have a non empty table', function() {
        loansBookPage = new LoansBookPage();
        loansBookPage.get();

        loansBookPage.runThroughLoansTable(function(rows) {
            expect(rows.length).toBeGreaterThan(0);
        });
    });

    describe('Modal to send an RFQ', function() {
        var originatorSelectedLoan;
        var amountSelectedLoan;
        var gradeSelectedLoan;
        var interestSelectedLoan;

        it('should display the selected loan at the top of the modal', function() {
            loansBookPage.inFirstRow(function(cells) {
                originatorSelectedLoan = cells[0].getText();
                amountSelectedLoan = cells[7].getText();
                gradeSelectedLoan = cells[2].getText();
                interestSelectedLoan = cells[8].getText();
            });

            loansBookPage.displayModalFirstRow();

            loansBookPage.runThroughModalTable(function(cells) {
                var originator = cells[1].getText();
                var amount = cells[2].getText();
                var grade = cells[3].getText();
                var interest = cells[4].getText();

                expect(originatorSelectedLoan).toBe(originator);
                expect(amountSelectedLoan).toBe(amount);
                expect(gradeSelectedLoan).toBe(grade);
                expect(interestSelectedLoan).toBe(interest);
            });
        });

        it('should have the correct fields', function() {
            expect(loansBookPage.durationInput.isPresent()).toBe(true);
            expect(loansBookPage.creditEventInput.isPresent()).toBe(true);
            expect(loansBookPage.counterpartyInput.isPresent()).toBe(true);
            expect(loansBookPage.quoteWindowInput.isPresent()).toBe(true);
            expect(loansBookPage.cdsValueInput.isPresent()).toBe(true);
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

        it('should be able to send an RFQ', function() {
            var successModal = new SuccessModal();
            cdsRandomValue = (Math.floor(Math.random() * 9999) + 1).toString();

            loansBookPage.sendRfq(cdsRandomValue);
            successModal.waitForSuccessMessage();

            expect(element(successModal.modalElement).isPresent()).toBe(true);
            expect(successModal.alertMessage.getText()).toBe('RFQ submitted !');

            expect(successModal.okBtn.isPresent()).toBe(true);
            successModal.okBtn.click();

            expect(element(successModal.modalElement).isPresent()).toBe(false);
        });

        it('should show a popup displaying PDX\'s autoquoting', function() {
            var popupLocator = by.css('.cg-notify-message-template');
            browser.wait(protractor.until.elementLocated(popupLocator), 15000, "No auto-quoting popup displayed.");
            expect(element(popupLocator).isPresent()).toBe(true);

            expect(element(by.binding('quote.dealer')).getText()).toBe('PDX');
        });
    });

    it('should show the new RFQ in Dealer1\'s submitted RFQs\' table', function() {
        submittedRfqs.get();

        submittedRfqs.inRfqsTableFirstRow(function(cells) {
            var cdsValue = cells[7];
            expect(cdsValue.getText()).toBe(cdsRandomValue);
        });
    });

    it('should display the automatic quote as Outstanding', function() {
        submittedRfqs.inQuotesTableFirstRow(function(cells) {
            var stateCell = cells[5];
            expect(stateCell.getText()).toBe('Outstanding');
        });
    });

    it('should show the new RFQ in Dealer2\'s incoming RFQ table', function() {
        var loginPage = new LoginPage();
        loginPage.get();
        loginPage.loginDealer2();

        var incomingRfqs = new IncomingRfqs();
        incomingRfqs.get();

        incomingRfqs.inRfqsTableFirstRow(function(cells) {
            var cdsValue = cells[6];
            expect(cdsValue.getText()).toBe(cdsRandomValue);
        });
    });
});