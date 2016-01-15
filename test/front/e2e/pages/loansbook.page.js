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
    this.modalCancelButtonElement = element(by.id('cancel'));

    var rowsLocator = by.css('.ui-grid-render-container.ng-isolate-scope.ui-grid-render-container-body > .ui-grid-viewport.ng-isolate-scope > .ui-grid-canvas > .ui-grid-row.ng-scope');
    var tableLinesLocator = by.css('tr.loan');
    var rfqButtonLocator = by.css('span.label.label-primary');
    var cellsSelector = by.css('.ui-grid-cell.ng-scope');

    this.rowsLocator = rowsLocator;

    var originatorValue = function(cells) { return cells[0].getText(); };
    var amountValue = function(cells) { return cells[7].getText(); };
    var gradeValue = function(cells) { return cells[2].getText(); };
    var interestValue = function(cells) { return cells[8].getText(); };

    this.originatorValue = originatorValue;
    this.amountValue = amountValue;
    this.gradeValue = gradeValue;
    this.interestValue = interestValue;

    this.originatorValueInModalTable = function(cells) { return cells[1].getText(); };
    this.amountValueInModalTable = function(cells) { return cells[2].getText(); };
    this.gradeValueInModalTable = function(cells) { return cells[3].getText(); };
    this.interestValueInModalTable = function(cells) { return cells[4].getText(); };

    var modalLocator = by.css('.modal-content');
    this.modalLocator = modalLocator;

    this.get = function() {
        browser.get('http://localhost:9000/#/loanbook');
        browser.wait(protractor.until.elementLocated(rowsLocator), 5000, "The loans table has not been loaded.");
    };

    this.runThroughLoansTable = function(callback) {
        element.all(rowsLocator).then(function(rows) {
            callback(rows);
        });
    };

    this.inFirstRow = function(callback) {
        this.runThroughLoansTable(function(rows) {
            expect(rows.length).toBeGreaterThan(0);
            rows[0]
                .all(cellsSelector)
                .then(function(cells) {
                    callback(cells);
                });
        });
    };

    this.displayModalFirstRow = function() {
        this.runThroughLoansTable(function(rows) {
            var firstRfqButton = rows[0].element(by.css('span.label.label-primary'));
            firstRfqButton.click();
        });

        browser.wait(protractor.until.elementLocated(modalLocator), 2000, "The modal doesn't show.");
        browser.wait(protractor.until.elementLocated(tableLinesLocator), 2000, "The modal's table doesn't show.");
    };

    this.runThroughModalTable = function(callback) {
        element.all(tableLinesLocator).then(function(trs) {
            callback(trs);
        })
    };

    this.inFirstRowInModalTable = function(callback) {
        this.runThroughModalTable(function(trs) {
            trs[0].all(by.tagName('td')).then(function(cells) {
                callback(cells);
            });
        });
    };

    this.selectNfirstRows = function(n) {
        var i;
        var selectedLoans = [];

        this.runThroughLoansTable(function(rows) {
            for (i = 0; i < n; i++) {
                rows[i].all(cellsSelector)
                    .then(function(cells) {
                        var loanValues = {};
                        loanValues.originator = originatorValue(cells);
                        loanValues.amount = amountValue(cells);
                        loanValues.grade = gradeValue(cells);
                        loanValues.interest = interestValue(cells);
                        selectedLoans.push(loanValues);
                    });
            }
        });

        element.all(by.css('.left.ui-grid-render-container-left.ui-grid-render-container.ui-grid-render-container > .ui-grid-viewport.ng-isolate-scope > .ui-grid-canvas > .ui-grid-row'))
            .then(function(rows) {
                var i;
                for (i = 0; i < n; i++) {
                    rows[i].click();
                }
            });

        this.runThroughLoansTable(function(rows) {
            rows[i-1].element(rfqButtonLocator).click();
        });

        return selectedLoans;
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