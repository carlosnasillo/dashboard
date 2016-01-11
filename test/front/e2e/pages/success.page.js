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

var SuccessModal = function() {
    this.modalElement = by.css('.sweet-alert.showSweetAlert.visible');
    this.alertMessage = element(this.modalElement).element(by.css('p[style="display: block;"]'));
    this.okBtn = element(this.modalElement).element(by.css('button.confirm'));

    this.waitForSuccessMessage = function() {
        browser.wait(protractor.until.elementLocated(this.modalElement), 4000, "No success message displayed.");
    }
};

module.exports = SuccessModal;