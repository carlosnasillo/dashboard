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

    function login(dealerNo) {
        element(by.model('vm.username')).sendKeys("dealer" + dealerNo + "@latticemarkets.com");
        element(by.model('vm.password')).sendKeys("D$al3r" + dealerNo + "");
        element(by.css('.btn.btn-primary')).click();
        expect(browser.getLocationAbsUrl()).toBe('/dashboard');
    }

    this.loginDealer1 = function() {
        login("1");
    };

    this.loginDealer2 = function() {
        login("2");
    };

    this.loginDealer3 = function() {
        login("3");
    };

    this.logout = function() {
        element(by.id('logout')).click();
    };
};

module.exports = LoginPage;