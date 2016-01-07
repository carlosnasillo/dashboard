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

var LoginPage = function() {
    this.get = function() {
        browser.get('http://localhost:9000/');
    };

    this.loginDealer1 = function() {
        element(by.model('vm.username')).sendKeys("dealer1@latticemarkets.com");
        element(by.model('vm.password')).sendKeys("D$al3r1");
        element(by.css('.btn.btn-primary')).click();
    };

    this.loginDealer2 = function() {
        element(by.model('vm.username')).sendKeys("dealer2@latticemarkets.com");
        element(by.model('vm.password')).sendKeys("D$al3r2");
        element(by.css('.btn.btn-primary')).click();
    };

    this.logout = function() {
        element(by.id('logout')).click();
    };
};

module.exports = LoginPage;