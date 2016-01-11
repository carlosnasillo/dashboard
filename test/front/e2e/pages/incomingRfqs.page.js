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

var IncomingRfqs = function() {
    var modalLocator = by.css('.modal-content');
    var rowsLocator = by.css('.ui-grid-row.ng-scope');

    this.modalElement = element(modalLocator);

    this.get = function() {
        browser.get('http://localhost:9000/#/quotes');

        browser.wait(protractor.until.elementLocated(rowsLocator), 5000, "The RFQs table in Incoming RFQs has not been loaded.");
    };

    this.runThroughRfqsTable = function(callback) {
        element(by.id('rfqs')).all(rowsLocator).then(function(rows) {
            callback(rows);
        });
    };

    this.runThroughQuotesTable = function(callback) {
        element(by.id('quotes')).all(rowsLocator).then(function(rows) {
            callback(rows);
        });
    };

    this.inRfqsTableFirstRow = function(callback) {
        this.runThroughRfqsTable(function(rows) {
            expect(rows.length).toBeGreaterThan(0);
            rows[0]
                .all(by.css('.ui-grid-cell.ng-scope'))
                .then(function(cells) {
                    callback(cells);
                });
        });
    };

    this.inQuotesTableFirstRow = function(callback) {
        this.runThroughQuotesTable(function(rows) {
            expect(rows.length).toBeGreaterThan(0);
            rows[0]
                .all(by.css('.ui-grid-cell.ng-scope'))
                .then(function(cells) {
                    callback(cells);
                });
        });
    };

    this.displayModalFirstRow = function() {
        this.inRfqsTableFirstRow(function(cells) {
            var firstRfqButton = cells[7].element(by.tagName('button'));
            expect(firstRfqButton.isPresent()).toBe(true);

            browser.wait(protractor.ExpectedConditions.elementToBeClickable(firstRfqButton), 4000)
                .then(function () {
                    expect(firstRfqButton.getAttribute('disabled')).toBeNull();
                    firstRfqButton.click();
                });
        });

        browser.wait(protractor.until.elementLocated(modalLocator), 4000, "The new quote modal didn't show up.");
    };

    this.submitQuote = function(premium) {
        var premiumInput = element(by.id('premium'));
        var windowInput = element(by.id('windowInMinutes'));

        windowInput.sendKeys(2);
        premiumInput.sendKeys(premium);

        var sendQuoteButton = element(modalLocator).element(by.css('button.btn.btn-primary'));
        expect(sendQuoteButton.getAttribute('disabled')).toBeNull();
        sendQuoteButton.click();
    }
};

module.exports = IncomingRfqs;