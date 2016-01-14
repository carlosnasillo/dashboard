/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 08/01/2016
*/

'use strict';

var LoansBookPage = function() {
    this.counterpartyInput = element(by.model('form.counterparty'));
    this.durationInput = element(by.model('form.duration'));
    this.creditEventInput = element(by.model('form.creditEvent'));
    this.quoteWindowInput = element(by.model('form.quoteWindow'));
    this.cdsValueInput = element(by.model('form.cdsValue'));

    this.get = function() {
        browser.get('http://localhost:9000/#/loanbook');

        var rowsLocator = by.css('.ui-grid-row.ng-scope');
        browser.wait(protractor.until.elementLocated(rowsLocator), 5000, "The loans table has not been loaded.");
    };

    this.inFirstRow = function(callback) {
        element.all(rowsLocator).then(function(rows) {
            expect(rows.length).toBeGreaterThan(0);
            rows[0]
                .all(by.css('.ui-grid-cell.ng-scope'))
                .then(function(cells) {
                    callback(cells);
                });
        });
    };

    this.displayModalFirstRow = function() {
        var firstRfqButton = element(by.css('span.label.label-primary'));
        firstRfqButton.click();

        var modalLocator = by.css('.modal-content');
        browser.wait(protractor.until.elementLocated(modalLocator), 2000, "The modal doesn't show.");
    };

    this.sendRfq = function(cdsValue) {
        var sendBtn = element(by.id('sendRfq'));
        expect(sendBtn.getAttribute('disabled')).toBe('true');

        this.durationInput.sendKeys(36);
        this.cdsValueInput.sendKeys(cdsValue);
        this.quoteWindowInput.sendKeys(10);

        element(by.id('creditEventSelectAll')).click();

        selectDealer2();

        expect(sendBtn.getAttribute('disabled')).toBeNull();

        sendBtn.click();

        function selectDealer2() {
            element(by.id('counterparty_chosen'))
                .element(by.css('.chosen-choices'))
                .click();

            element(by.id('counterparty_chosen'))
                .all(by.css('.active-result'))
                .first()
                .click();
        }
    };
};

module.exports = LoansBookPage;