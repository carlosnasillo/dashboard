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

var SdrPage = function() {
    var rowsLocator = by.css('.ui-grid-row.ng-scope');

    this.get = function() {
        browser.get('http://localhost:9000/#/sdr');
        browser.wait(protractor.until.elementLocated(rowsLocator), 5000, "The trades table in SDR tab has not been loaded.");
    };

    this.inTradesTableFirstRow = function(callback) {
        runThroughTradesTable(function(rows) {
            expect(rows.length).toBeGreaterThan(0);
            rows[0]
                .all(by.css('.ui-grid-cell.ng-scope'))
                .then(function(cells) {
                    callback(cells);
                });
        });
    };

    function runThroughTradesTable(callback) {
        element.all(rowsLocator).then(function(rows) {
            callback(rows);
        });
    }
};

module.exports = SdrPage;