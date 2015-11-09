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

    LoansController.$inject = ['LoansService'];

    function LoansController(LoansService) {
        var vm = this;

        vm.loansTable = {};

        LoansService.loansAvailable().success(function(data) {
            vm.loansTable.options.data = data.loans;
        });

        vm.loansTable.options = {
            enableColumnMenus: false,
            enableSorting: true,
            columnDefs: [{ field: 'id', name: 'Listing Id' }, { field: 'listD', name: 'Listed'}, { field: 'loanAmount', name: 'Requested' }, { field: 'fundedAmount', name: 'Founded' }, { field: 'grade' }, { field: 'term' }, { field: 'purpose' }]
        }
    }
})();