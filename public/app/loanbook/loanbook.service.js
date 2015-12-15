/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

/**
* @author : julienderay
* Created on 11/12/2015
*/

(function(){
    'use strict';

    angular
        .module('app')
        .factory('LoanBookService', LoanBookService);

    LoanBookService.$inject = ['$q'];

    function LoanBookService($q) {
        var mockedLoanBook = [
            { id: 355576, originator: "Lending Club", status: "open", grade: "C", purpose: "Asset purchase", sector: "Leisure & Hospitality", type: "Limited Company", region: "North East", amount: "40000", interest: "0.14", term: 36, principalRemaining: "1000", nextPayment: "23/12/2015", loanDate: "02/12/2015", security: "No asset security"},
            { id: 547866, originator: "Prosper", status: "open", grade: "A", purpose: "Working capital", sector: "Wholesale", type: "Limited Company", region: "North East", amount: "9000", interest: "0.05", term: 36, principalRemaining: "6000", nextPayment: "21/12/2015", loanDate: "02/11/2015", security: "No asset security"},
            { id: 54734798326, originator: "Lending Club", status: "open", grade: "A", purpose: "Asset purchase", sector: "Wholesale", type: "Limited Company", region: "South East", amount: "12000", interest: "0.04", term: 36, principalRemaining: "2000", nextPayment: "17/12/2015", loanDate: "06/12/2015", security: "No asset security"},
            { id: 164934, originator: "Lending Club", status: "open", grade: "C", purpose: "Expansion/growth Capital", sector: "Leisure & Hospitality", type: "Limited Company", region: "Scotland", amount: "4500", interest: "0.14", term: 36, principalRemaining: "3000", nextPayment: "02/01/2016", loanDate: "11/11/2015", security: "No asset security"},
            { id: 6144682, originator: "Prosper", status: "open", grade: "F", purpose: "Working capital", sector: "Leisure & Hospitality", type: "Limited Company", region: "North East", amount: "90000", interest: "0.01", term: 36, principalRemaining: "23000", nextPayment: "23/03/2016", loanDate: "08/12/2015", security: "No asset security"},
            { id: 2370427, originator: "Prosper", status: "open", grade: "D", purpose: "Asset purchase", sector: "Professional and Business Support", type: "Limited Company", region: "Scotland", amount: "12000", interest: "0.24", term: 36, principalRemaining: "2000", nextPayment: "01/02/2016", loanDate: "06/12/2015", security: "No asset security"},
            { id: 1834847, originator: "Prosper", status: "open", grade: "E", purpose: "Expansion/growth Capital", sector: "Wholesale", type: "Limited Company", region: "South East", amount: "234000", interest: "0.11", term: 36, principalRemaining: "32000", nextPayment: "14/01/2016", loanDate: "06/12/2015", security: "No asset security"},
            { id: 72960, originator: "Lending Club", status: "open", grade: "D", purpose: "Asset purchase", sector: "Professional and Business Support", type: "Limited Company", region: "Scotland", amount: "4323000", interest: "0.24", term: 36, principalRemaining: "423000", nextPayment: "11/01/2016", loanDate: "01/12/2015", security: "No asset security"},
            { id: 7251708, originator: "Lending Club", status: "open", grade: "C", purpose: "Expansion/growth Capital", sector: "Wholesale", type: "Limited Company", region: "North East", amount: "443000", interest: "0.32", term: 36, principalRemaining: "53000", nextPayment: "08/01/2016", loanDate: "02/12/2015", security: "No asset security"},
            { id: 2385047, originator: "Lending Club", status: "open", grade: "A", purpose: "Asset purchase", sector: "Leisure & Hospitality", type: "Limited Company", region: "North East", amount: "847000", interest: "0.03", term: 36, principalRemaining: "980", nextPayment: "05/01/2016", loanDate: "04/12/2015", security: "No asset security"},
            { id: 74702475, originator: "Prosper", status: "open", grade: "A", purpose: "Working capital", sector: "Wholesale", type: "Limited Company", region: "South East", amount: "4000", interest: "0.04", term: 36, principalRemaining: "1300", nextPayment: "30/01/2016", loanDate: "09/12/2015", security: "No asset security"},
            { id: 24795, originator: "Prosper", status: "open", grade: "B", purpose: "Working capital", sector: "Leisure & Hospitality", type: "Limited Company", region: "North East", amount: "74000", interest: "0.04", term: 36, principalRemaining: "3200", nextPayment: "05/01/2016", loanDate: "08/12/2015", security: "No asset security"},
            { id: 2342543, originator: "Lending Club", status: "open", grade: "C", purpose: "Asset purchase", sector: "Consumer Services", type: "Limited Company", region: "Scotland", amount: "90000", interest: "0.14", term: 36, principalRemaining: "80000", nextPayment: "31/12/2015", loanDate: "09/12/2015", security: "No asset security"},
            { id: 24349075, originator: "Prosper", status: "open", grade: "F", purpose: "Expansion/growth Capital", sector: "Professional and Business Support", type: "Limited Company", region: "Scotland", amount: "234000", interest: "0.12", term: 36, principalRemaining: "23000", nextPayment: "10/02/2016", loanDate: "02/12/2015", security: "No asset security"},
            { id: 24297, originator: "Prosper", status: "open", grade: "C", purpose: "Asset purchase", sector: "Consumer Services", type: "Limited Company", region: "North East", amount: "43000", interest: "0.13", term: 36, principalRemaining: "43000", nextPayment: "23/12/2016", loanDate: "15/12/2015", security: "No asset security"},
            { id: 9873694, originator: "Lending Club", status: "open", grade: "G", purpose: "Asset purchase", sector: "Wholesale", type: "Limited Company", region: "North East", amount: "88000", interest: "0.17", term: 36, principalRemaining: "9000", nextPayment: "23/12/2016", loanDate: "12/12/2015", security: "No asset security"},
            { id: 76484, originator: "Lending Club", status: "open", grade: "B", purpose: "Working capital", sector: "Consumer Services", type: "Limited Company", region: "North East", amount: "90000", interest: "0.06", term: 36, principalRemaining: "74000", nextPayment: "04/03/2016", loanDate: "04/12/2015", security: "No asset security"},
            { id: 664084, originator: "Lending Club", status: "open", grade: "B", purpose: "Asset purchase", sector: "Professional and Business Support", type: "Limited Company", region: "North East", amount: "6573000", interest: "0.01", term: 36, principalRemaining: "483000", nextPayment: "02/12/2015", loanDate: "02/12/2015", security: "No asset security"},
            { id: 547740, originator: "Prosper", status: "open", grade: "C", purpose: "Asset purchase", sector: "Wholesale", type: "Limited Company", region: "Scotland", amount: "443000", interest: "0.04", term: 36, principalRemaining: "43000", nextPayment: "23/12/2016", loanDate: "15/12/2015", security: "No asset security"}
        ];

        function loanBookDataPromise() {
            return $q(function(resolve, reject) {
                setTimeout(function() {
                    resolve(mockedLoanBook);
                }, 1000);
            });
        }

        var loanBookData = function() {
            if (loanBookDataPromise) {
                return loanBookDataPromise;
            } else {
                loanBookDataPromise = $http.get("/api/loanbook");
                return loanBookDataPromise;
            }
        };

        return {
            loanBookData: loanBookData()
        };
    }
})();