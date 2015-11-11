/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

/**
 * Created by julienderay on 09/11/2015.
 */

(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoansController', LoansController);

    LoansController.$inject = ['LoansService', '$filter'];

    function LoansController(LoansService, $filter) {
        var vm = this;

        vm.loansTable = {};

        LoansService.loansAvailable().success(function(data) {
            vm.loansTable.options.data = data.loans;
            vm.loansTable.options.data.map(function(loan) {
                var tmpLoan = loan;
                tmpLoan.listD = $filter('date')(loan.listD, 'dd/MM/yyyy');
                return tmpLoan;
            })
        });

        vm.loansTable.options = {
            enableColumnMenus: false,
            enableSorting: true,
            columnDefs: [
                { field: 'id', displayName: 'Listing Id' },
                { field: 'listD', displayName: 'Listed'},
                { field: 'loanAmount', displayName: 'Requested' },
                { field: 'fundedAmount', displayName: 'Founded' },
                { field: 'grade' },
                { field: 'term' },
                { field: 'purpose' }]
        }
    }
})();