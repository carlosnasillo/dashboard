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
            {
                id: 5476,
                originator: "Lending Club",
                status: "open",
                grade: "C",
                purpose: "house",
                sector: "home",
                type: "type",
                region: "4",
                amount: "4000.01",
                interest: "0.04",
                term: 36,
                principalRemaining: "1000",
                nextPayment: "23",
                loanDate: "2016-01-01",
                security: "--"
            }
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