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

var SubmittedRfqs = function() {
    var rowsLocator = by.css('.ui-grid-row.ng-scope');

    this.get = function() {
        browser.get('http://localhost:9000/#/rfqs');
        browser.wait(protractor.until.elementLocated(rowsLocator), 5000, "The RFQs table in Submitted Rfqs has not been loaded.");
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
            runThroughRowsCell(rows[0], callback);
        });
    };

    this.inQuotesTableFirstRow = function(callback) {
        this.runThroughQuotesTable(function(rows) {
            expect(rows.length).toBeGreaterThan(0);
            runThroughRowsCell(rows[0], callback);
        });
    };

    function runThroughRowsCell(rowElement, callback) {
        rowElement
            .all(by.css('.ui-grid-cell.ng-scope'))
            .then(function(cells) {
                callback(cells);
            });
    }
};

module.exports = SubmittedRfqs;