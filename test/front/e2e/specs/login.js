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

var LoginPage = require('../pages/login.page.js');

describe('Login page tests', function() {
    var loginPage;

    beforeEach(function(){
        loginPage = new LoginPage();
        loginPage.get();
    });

    it('should display the login page', function() {
        var usernameInput = element(by.model('vm.username'));
        var passwordInput = element(by.model('vm.password'));
        var submitButton = element(by.css('.btn.btn-primary'));

        expect(usernameInput.isPresent()).toBe(true);
        expect(passwordInput.isPresent()).toBe(true);
        expect(submitButton.isPresent()).toBe(true);
    });

    it('should log in successfully', function() {
        loginPage.loginDealer1();

        expect(browser.getLocationAbsUrl()).toBe('/dashboard');
    });
});