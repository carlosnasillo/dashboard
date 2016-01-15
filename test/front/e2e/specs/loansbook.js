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

function randomBetween(from, to) {
    return Math.floor(Math.random() * to) + from;
}

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

        it('should be able to selected several loans and retrieve them in the loans table in the modal window', function() {
            var howManyLoansToSelect = randomBetween(2, 10);

            var selectedLoans = loansBookPage.selectNfirstRows(howManyLoansToSelect);

            loansBookPage.runThroughModalTable(function(trs) {
                expect(trs.length).toBe(howManyLoansToSelect);

                trs.forEach(function(tr, index) {
                    tr.all(by.tagName('td')).then(function(cells) {
                        var originator = loansBookPage.originatorValueInModalTable(cells);
                        var amount =  loansBookPage.amountValueInModalTable(cells);
                        var grade = loansBookPage.gradeValueInModalTable(cells);
                        var interest = loansBookPage.interestValueInModalTable(cells);

                        expect(selectedLoans[index].originator).toBe(originator);
                        expect(selectedLoans[index].amount).toBe(amount);
                        expect(selectedLoans[index].grade).toBe(grade);
                        expect(selectedLoans[index].interest).toBe(interest);
                    });
                });
            });
        });

        it('should be able to hide the modal window by hitting the Cancel button', function() {
            expect(element(loansBookPage.modalLocator).isPresent()).toBeTruthy();
            loansBookPage.modalCancelButtonElement.click();
            expect(element(loansBookPage.modalLocator).isPresent()).toBeFalsy();
        });

        it('should display the selected loan at the top of the modal', function() {
            loansBookPage.get();

            loansBookPage.inFirstRow(function(cells) {
                originatorSelectedLoan = loansBookPage.originatorValue(cells);
                amountSelectedLoan = loansBookPage.amountValue(cells);
                gradeSelectedLoan = loansBookPage.gradeValue(cells);
                interestSelectedLoan = loansBookPage.interestValue(cells);
            });

            loansBookPage.displayModalFirstRow();

            loansBookPage.inFirstRowInModalTable(function(cells) {
                var originator = loansBookPage.originatorValueInModalTable(cells);
                var amount =  loansBookPage.amountValueInModalTable(cells);
                var grade = loansBookPage.gradeValueInModalTable(cells);
                var interest = loansBookPage.interestValueInModalTable(cells);

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
            cdsRandomValue = randomBetween(1, 9999).toString();

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