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

    LoansController.$inject = ['LoansService', '$filter', '$scope', 'LoansTableService', 'NotesTableService', 'GridTableUtil', 'OrderLoansModalService'];

    function LoansController(LoansService, $filter, $scope, LoansTableService, NotesTableService, GridTableUtil, OrderLoansModalService) {
        var vm = this;

        // Hardcoded since we don't really manage this for now
        vm.investorId = 'BlackRock';
        vm.originalData = { loans: [], notes: [] };

        /**
         * Loans Table
         */

        vm.loansTable = { options: {} };

        LoansService.loansAvailable().success(function(data) {

            vm.loansTable.options.data = data.loans.map(function(data) {
                data.fundedAmountPerCent = (data.fundedAmount / data.loanAmount) * 100;
                data.foundedPie = [data.fundedAmountPerCent, 100 - data.fundedAmountPerCent];

                data.originator = "Lending Club";

                data.listDtoFormattedDate = $filter('date')(data.listD, "dd/MM/yyyy");

                return data;
            });

            vm.originalData.loans = vm.loansTable.options.data;
        });

        vm.globalFilterLoans = {
            value: "",
            onChange: function() {
                var filterValue = vm.globalFilterLoans.value;
                if ( filterValue.length > 0 ) {
                    vm.loansTable.options.data = vm.originalData.loans.filter(
                        LoansTableService.globalFilterFactory( filterValue )
                    );
                }
                else {
                    vm.loansTable.filters.filterLoans();
                }
            }
        };

        vm.loansTable.filters = {};

        vm.loansTable.filters.listD = GridTableUtil.dateFilterFactory(vm.originalData.loans, function(filteredData) { vm.loansTable.options.data = filteredData; }, 'listDtoFormattedDate');

        vm.loansTable.filters.filterLoans = function () {
                vm.loansTable.options.data = vm.originalData.loans.filter(function (loanObj) {
                    return vm.loansTable.filters.identifier.filterFn(loanObj) &&
                        vm.loansTable.filters.originator.filterFn(loanObj) &&
                        vm.loansTable.filters.loanAmount.start.filterFn(loanObj) &&
                        vm.loansTable.filters.loanAmount.end.filterFn(loanObj) &&
                        vm.loansTable.filters.fundedAmountPerCent.start.filterFn(loanObj) &&
                        vm.loansTable.filters.fundedAmountPerCent.end.filterFn(loanObj) &&
                        vm.loansTable.filters.grade.filterFn(loanObj) &&
                        vm.loansTable.filters.term.start.filterFn(loanObj) &&
                        vm.loansTable.filters.term.end.filterFn(loanObj) &&
                        vm.loansTable.filters.intRate.start.filterFn(loanObj) &&
                        vm.loansTable.filters.intRate.end.filterFn(loanObj) &&
                        vm.loansTable.filters.purpose.filterFn(loanObj);
                });
                GridTableUtil.applyDateFilter(
                    vm.loansTable.filters.listD.start.value,
                    vm.loansTable.filters.listD.end.value,
                    'listDtoFormattedDate',
                    vm.loansTable.options.data,
                    function (filteredData) {
                        vm.loansTable.options.data = filteredData;
                    });
            };

        vm.loansTable.filters.identifier = LoansTableService.identifierFilterFactory(vm.loansTable.filters.filterLoans);
        vm.loansTable.filters.originator = LoansTableService.originatorFilterFactory(vm.loansTable.filters.filterLoans);
        vm.loansTable.filters.loanAmount = LoansTableService.loanAmountFilterFactory(vm.loansTable.filters.filterLoans);
        vm.loansTable.filters.fundedAmountPerCent = LoansTableService.fundedAmountPerCentFilterFactory(vm.loansTable.filters.filterLoans);
        vm.loansTable.filters.grade = LoansTableService.gradeFilterFactory(vm.loansTable.filters.filterLoans);
        vm.loansTable.filters.term = LoansTableService.termFilterFactory(vm.loansTable.filters.filterLoans);
        vm.loansTable.filters.intRate = LoansTableService.intRateFilterFactory(vm.loansTable.filters.filterLoans);
        vm.loansTable.filters.purpose = LoansTableService.purposeFilterFactory(vm.loansTable.filters.filterLoans);

        vm.loansTable.pieChartOptions = {
            fill: ["#00b494", "#d7d7d7"],
            width: 50
        };

        $scope.$watch('vm.loansTable.filters.listD.start.value', vm.loansTable.filters.filterLoans, false);
        $scope.$watch('vm.loansTable.filters.listD.end.value', vm.loansTable.filters.filterLoans, false);

        vm.loansTable.options = LoansTableService.options;

        /**
         * Owned Notes Table
         */

        vm.notesTable = { options: {} };

        LoansService.ownedNotes(vm.investorId).success(function(data) {

            vm.notesTable.options.data = data.map(function(data) {
                data.issueDatetoFormattedDate = $filter('date')(data.issueDate, "dd/MM/yyyy");
                data.orderDatetoFormattedDate = $filter('date')(data.orderDate, "dd/MM/yyyy");

                return data;
            });

            //vm.originalData.notes = vm.notesTable.options.data;
            vm.notesTable.options.data = [{
                "noteId":9796230,
                "loanAmount":15000,
                "noteAmount":7500,
                "term":36,
                "interestRate":21.99,
                "grade":"E",
                "issueDate":"2015-11-05T06:41:58",
                "issueDatetoFormattedDate":"05/11/2015",
                "orderDate":"2015-11-05T06:41:58",
                "orderDatetoFormattedDate":"05/11/2015",
                "purpose":"house",
                "fundedAmountPerCent":0,
                "foundedPie":[0, 100],
                "originator":"Lending Club",
                "$$hashKey":"uiGrid-0019"
            }];
            vm.originalData.notes = vm.notesTable.options.data;
        });

        vm.notesTable.filters = {};

        vm.notesTable.filters.issueDate = GridTableUtil.dateFilterFactory(vm.originalData.notes, function(filteredData) { vm.notesTable.options.data = filteredData; }, 'issueDatetoFormattedDate');
        vm.notesTable.filters.orderDate = GridTableUtil.dateFilterFactory(vm.originalData.notes, function(filteredData) { vm.notesTable.options.data = filteredData; }, 'orderDatetoFormattedDate');

        vm.notesTable.filters.filterNotes = function () {
            vm.notesTable.options.data = vm.originalData.notes.filter(function (noteObj) {
                return vm.notesTable.filters.noteId.filterFn(noteObj) &&
                    vm.notesTable.filters.loanAmount.start.filterFn(noteObj) &&
                    vm.notesTable.filters.loanAmount.end.filterFn(noteObj) &&
                    vm.notesTable.filters.noteAmount.start.filterFn(noteObj) &&
                    vm.notesTable.filters.noteAmount.end.filterFn(noteObj) &&
                    vm.notesTable.filters.grade.filterFn(noteObj) &&
                    vm.notesTable.filters.term.start.filterFn(noteObj) &&
                    vm.notesTable.filters.term.end.filterFn(noteObj) &&
                    vm.notesTable.filters.interestRate.start.filterFn(noteObj) &&
                    vm.notesTable.filters.interestRate.end.filterFn(noteObj) &&
                    vm.notesTable.filters.purpose.filterFn(noteObj);
            });
            GridTableUtil.applyDateFilter(
                vm.notesTable.filters.issueDate.start.value,
                vm.notesTable.filters.issueDate.end.value,
                'issueDatetoFormattedDate',
                vm.notesTable.options.data,
                function (filteredData) {
                    vm.notesTable.options.data = filteredData;
                });
            GridTableUtil.applyDateFilter(
                vm.notesTable.filters.orderDate.start.value,
                vm.notesTable.filters.orderDate.end.value,
                'orderDatetoFormattedDate',
                vm.notesTable.options.data,
                function (filteredData) {
                    vm.notesTable.options.data = filteredData;
                });
        };

        vm.notesTable.filters.noteId = NotesTableService.noteIdFilterFactory(vm.notesTable.filters.filterNotes);
        vm.notesTable.filters.loanAmount = NotesTableService.loanAmountFilterFactory(vm.notesTable.filters.filterNotes);
        vm.notesTable.filters.noteAmount = NotesTableService.noteAmountFilterFactory(vm.notesTable.filters.filterNotes);
        vm.notesTable.filters.grade = NotesTableService.gradeFilterFactory(vm.notesTable.filters.filterNotes);
        vm.notesTable.filters.term = NotesTableService.termFilterFactory(vm.notesTable.filters.filterNotes);
        vm.notesTable.filters.interestRate = NotesTableService.interestRateFilterFactory(vm.notesTable.filters.filterNotes);
        vm.notesTable.filters.purpose = NotesTableService.purposeFilterFactory(vm.notesTable.filters.filterNotes);

        $scope.$watch('vm.notesTable.filters.issueDate.start.value', vm.notesTable.filters.filterNotes, false);
        $scope.$watch('vm.notesTable.filters.issueDate.end.value', vm.notesTable.filters.filterNotes, false);
        $scope.$watch('vm.notesTable.filters.orderDate.start.value', vm.notesTable.filters.filterNotes, false);
        $scope.$watch('vm.notesTable.filters.orderDate.end.value', vm.notesTable.filters.filterNotes, false);

        vm.globalFilterNotes = {
            value: "",
            onChange: function() {
                var filterValue = vm.globalFilterNotes.value;
                if ( filterValue.length > 0 ) {
                    vm.notesTable.options.data = vm.originalData.notes.filter(
                        NotesTableService.globalFilterFactory( filterValue )
                    );
                }
                else {
                    vm.notesTable.filters.filterNotes();
                }
            }
        };

        vm.notesTable.options = NotesTableService.options;

        /**
         * Order button
         */

        vm.order = OrderLoansModalService.orderModal;

        /**
         * Popover (see filters)
         */
        $("[data-toggle=popover]").popover();
    }
})();