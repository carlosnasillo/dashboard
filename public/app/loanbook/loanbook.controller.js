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

    LoanBookController.$inject = ['LoanBookService', 'LoanBookTableService', 'RfqModalService', '$routeParams', '$timeout'];

    function LoanBookController(LoanBookService, LoanBookTableService, RfqModalService, $routeParams, $timeout) {
        var vm = this;

        vm.loanBookTable = {};
        vm.loanBookTable.options = LoanBookTableService.options;


        LoanBookService.loanBookData().then(function(data) {
            vm.loanBookTable.options.data = data;

            $timeout(function() {
                if (vm.loanBookTable.gridApi.selection.selectRow) {
                    var loanId = $routeParams.loanId;
                    if (loanId) {
                        var selectedLoans = vm.loanBookTable.options.data.filter(function(loan) {
                            return loan.id == loanId;
                        });
                        if (selectedLoans.length === 1 && selectedLoans[0]) {
                            vm.loanBookTable.gridApi.selection.selectRow(selectedLoans[0]);
                        }
                    }
                }
            });
        });
        vm.loanBookTable.options.onRegisterApi = function(gridApi) {
            vm.loanBookTable.gridApi = gridApi;
        };


        vm.order = RfqModalService.orderModal;
    }
})();