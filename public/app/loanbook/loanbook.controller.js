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

    LoanBookController.$inject = ['LoanBookService', 'LoanBookTableService', 'RfqModalService', '$routeParams', '$timeout', 'GridTableUtil', '$filter', '$scope'];

    function LoanBookController(LoanBookService, LoanBookTableService, RfqModalService, $routeParams, $timeout, GridTableUtil, $filter, $scope) {
        var vm = this;

        vm.loanBookTable = {};
        vm.loanBookTable.options = LoanBookTableService.options;
        vm.originalData = [];

        LoanBookService.loanBookData().then(function(data) {
            data.map(function(loan) {
                loan.loanDateToFormattedDate = $filter('date')(loan.loanDate, "dd/MM/yyyy");
                loan.interestPerCent = loan.interest * 100;
                return loan;
            });

            vm.loanBookTable.options.data = data;
            vm.originalData = data;

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
        vm.loanBookTable.filters.grade = GridTableUtil.wordFilterFactory(vm.loanBookTable.filters.filterLoans, 'grade');
        vm.loanBookTable.filters.purpose = GridTableUtil.textFilterFactory(vm.loanBookTable.filters.filterLoans, 'purpose');
        vm.loanBookTable.filters.sector = GridTableUtil.textFilterFactory(vm.loanBookTable.filters.filterLoans, 'sector');
        vm.loanBookTable.filters.type = GridTableUtil.textFilterFactory(vm.loanBookTable.filters.filterLoans, 'type');
        vm.loanBookTable.filters.region = GridTableUtil.textFilterFactory(vm.loanBookTable.filters.filterLoans, 'region');
        vm.loanBookTable.filters.amount = GridTableUtil.doubleNumberFilterFactory(vm.loanBookTable.filters.filterLoans, 'amount');
        vm.loanBookTable.filters.interestPerCent = GridTableUtil.doublePercentFilterFactory(vm.loanBookTable.filters.filterLoans, 'interestPerCent');
        vm.loanBookTable.filters.term = GridTableUtil.doubleNumberFilterFactory(vm.loanBookTable.filters.filterLoans, 'term');
        vm.loanBookTable.filters.security = GridTableUtil.textFilterFactory(vm.loanBookTable.filters.filterLoans, 'security');

        $scope.$watch('vm.loanBookTable.filters.loanDate.start.value', vm.loanBookTable.filters.filterLoans, false);
        $scope.$watch('vm.loanBookTable.filters.loanDate.end.value', vm.loanBookTable.filters.filterLoans, false);
    }
})();