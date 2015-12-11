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
        .controller('LoanBookController', LoanBookController);

    LoanBookController.$inject = ['LoanBookService', 'LoanBookTableService'];

    function LoanBookController(LoanBookService, LoanBookTableService) {
        var vm = this;

        vm.loanBook = {};
        vm.loanBook.options = LoanBookTableService.options;

        LoanBookService.loanBookData().then(function(data) {
            vm.loanBook.options.data = Object.create(data);
        });
    }
})();