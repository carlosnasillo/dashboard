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
    this.get = function() {
        browser.get('http://localhost:9000/#/quotes');

        var rowsLocator = by.css('.ui-grid-row.ng-scope');
        browser.wait(protractor.until.elementLocated(rowsLocator), 5000, "The RFQs table in Incoming RFQs has not been loaded.");
    };
};

module.exports = IncomingRfqs;