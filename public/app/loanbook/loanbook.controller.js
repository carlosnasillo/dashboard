/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
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

    LoanBookController.$inject = ['LoanBookService', 'LoanBookTableService', 'RfqModalService', '$routeParams', '$timeout', 'GridTableUtil', '$filter', '$scope'];

    function LoanBookController(LoanBookService, LoanBookTableService, RfqModalService, $routeParams, $timeout, GridTableUtil, $filter, $scope) {
        var vm = this;

        vm.loanBookTable = {};
        vm.loanBookTable.options = LoanBookTableService.options;
        vm.originalData = [];

        LoanBookService.loanBookData().then(function(result) {
            result.data.map(function(loan) {
                loan.loanDateToFormattedDate = $filter('date')(loan.loan_accepted_date, "dd/MM/yyyy");
                loan.credit_band = loan.credit_band.split(' ')[0];
                return loan;
            });

            vm.loanBookTable.options.data = result.data;
            vm.originalData = result.data;

            $timeout(function() {
                if (vm.loanBookTable.gridApi.selection.selectRow) {
                    if ($routeParams.loansId) {
                        var loansId = $routeParams.loansId.split('+').map(function(id) { return parseInt(id); });
                        if (loansId) {
                            var selectedLoans = vm.loanBookTable.options.data.filter(function(loan) {
                                return loansId.indexOf(loan.id) >= 0;
                            });
                            selectedLoans.forEach(function(loan) {
                                vm.loanBookTable.gridApi.selection.selectRow(loan);
                            });
                        }
                    }
                }
            });
        });

        vm.loanBookTable.options.onRegisterApi = function(gridApi) {
            vm.loanBookTable.gridApi = gridApi;
        };

        vm.order = RfqModalService.orderModal;

        vm.loanBookTable.filters = {};
        vm.loanBookTable.filters.loanDate = GridTableUtil.dateFilterFactory(vm.originalData, function(filteredData) { vm.loanBookTable.options.data = filteredData; }, 'loanDateToFormattedDate');

        vm.loanBookTable.filters.filterLoans = function () {
            vm.loanBookTable.options.data = vm.originalData.filter(function (loanObj) {
                return vm.loanBookTable.filters.originator.filterFn(loanObj) &&
                vm.loanBookTable.filters.status.filterFn(loanObj) &&
                vm.loanBookTable.filters.grade.filterFn(loanObj) &&
                vm.loanBookTable.filters.purpose.filterFn(loanObj) &&
                vm.loanBookTable.filters.sector.filterFn(loanObj) &&
                vm.loanBookTable.filters.type.filterFn(loanObj) &&
                vm.loanBookTable.filters.region.filterFn(loanObj) &&
                vm.loanBookTable.filters.amount.start.filterFn(loanObj) &&
                vm.loanBookTable.filters.amount.end.filterFn(loanObj) &&
                vm.loanBookTable.filters.interestPerCent.start.filterFn(loanObj) &&
                vm.loanBookTable.filters.interestPerCent.end.filterFn(loanObj) &&
                vm.loanBookTable.filters.term.start.filterFn(loanObj) &&
                vm.loanBookTable.filters.term.end.filterFn(loanObj) &&
                vm.loanBookTable.filters.security.filterFn(loanObj);
            });
            GridTableUtil.applyDateFilter(
                vm.loanBookTable.filters.loanDate.start.value,
                vm.loanBookTable.filters.loanDate.end.value,
                'loanDateToFormattedDate',
                vm.loanBookTable.options.data,
                function (filteredData) {
                    vm.loanBookTable.options.data = filteredData;
                });
        };

        vm.loanBookTable.filters.originator = GridTableUtil.textFilterFactory(vm.loanBookTable.filters.filterLoans, 'originator');
        vm.loanBookTable.filters.status = GridTableUtil.textFilterFactory(vm.loanBookTable.filters.filterLoans, 'status');
        vm.loanBookTable.filters.grade = GridTableUtil.wordFilterFactory(vm.loanBookTable.filters.filterLoans, 'credit_band');
        vm.loanBookTable.filters.purpose = GridTableUtil.textFilterFactory(vm.loanBookTable.filters.filterLoans, 'loan_purpose');
        vm.loanBookTable.filters.sector = GridTableUtil.textFilterFactory(vm.loanBookTable.filters.filterLoans, 'sector');
        vm.loanBookTable.filters.type = GridTableUtil.textFilterFactory(vm.loanBookTable.filters.filterLoans, 'business_type_name');
        vm.loanBookTable.filters.region = GridTableUtil.textFilterFactory(vm.loanBookTable.filters.filterLoans, 'region_name');
        vm.loanBookTable.filters.amount = GridTableUtil.doubleNumberFilterFactory(vm.loanBookTable.filters.filterLoans, 'loan_amount');
        vm.loanBookTable.filters.interestPerCent = GridTableUtil.doublePercentFilterFactory(vm.loanBookTable.filters.filterLoans, 'interest_rate');
        vm.loanBookTable.filters.term = GridTableUtil.doubleNumberFilterFactory(vm.loanBookTable.filters.filterLoans, 'term');
        vm.loanBookTable.filters.security = GridTableUtil.textFilterFactory(vm.loanBookTable.filters.filterLoans, 'security_taken');

        $scope.$watch('vm.loanBookTable.filters.loanDate.start.value', vm.loanBookTable.filters.filterLoans, false);
        $scope.$watch('vm.loanBookTable.filters.loanDate.end.value', vm.loanBookTable.filters.filterLoans, false);
    }
})();