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
        vm.originalData = {};

        /**
         * Loans Table
         */

        vm.loansTable = { options: {} };

        LoansService.loansAvailable().success(function(data) {

            vm.loansTable.options.data = data.loans.map(function(data) {
                data.fundedAmountPerCenter = (data.fundedAmount / data.loanAmount) * 100;
                data.foundedPie = [data.fundedAmountPerCenter, 100 - data.fundedAmountPerCenter];

                data.originator = "Lending Club";

                data.listDToFormatedDate = $filter('date')(data.listD, "dd/MM/yyyy");

                return data;
            });

            vm.originalData.loans = vm.loansTable.options.data;
        });

        vm.globalFilterLoans = {
            value: "",
            onChange: function() {
                vm.loansTable.options.data = vm.originalData.loans.filter(
                    LoansTableService.globalFilterFactory( vm.globalFilterLoans.value )
                );
            }
        };

        vm.loansTable.pieChartOptions = {
            fill: ["#00b494", "#d7d7d7"],
            width: 50
        };

        vm.loansTable.datePicker = {
            date: {
                startDate: null,
                endDate: null
            },
            options: {
                singleDatePicker: true
            },
            reset: {
                start: function() { vm.loansTable.datePicker.date.startDate = null; },
                end: function() { vm.loansTable.datePicker.date.endDate = null; }
            }
        };

        $scope.$watch('vm.loansTable.datePicker.date.startDate', function() {
            GridTableUtil.applyDateFilter(
                vm.loansTable.datePicker.date.startDate,
                vm.loansTable.datePicker.date.endDate,
                'listDToFormatedDate',
                vm.originalData.loans,
                function(filteredData) { vm.loansTable.options.data = filteredData; });
        }, false);

        $scope.$watch('vm.loansTable.datePicker.date.endDate', function() {
            GridTableUtil.applyDateFilter(
                vm.loansTable.datePicker.date.startDate,
                vm.loansTable.datePicker.date.endDate,
                'listDToFormatedDate',
                vm.originalData.loans,
                function(filteredData) { vm.loansTable.options.data = filteredData; });
        }, false);

        vm.loansTable.options = LoansTableService.options;

        /**
         * Owned Notes Table
         */

        vm.notesTable = { options: {} };

        LoansService.ownedNotes(vm.investorId).success(function(data) {

            vm.notesTable.options.data = data.map(function(data) {
                data.issueDateToFormatedDate = $filter('date')(data.issueDate, "dd/MM/yyyy");
                data.orderDateToFormatedDate = $filter('date')(data.orderDate, "dd/MM/yyyy");

                return data;
            });

            vm.originalData.notes = vm.notesTable.options.data;
        });

        vm.notesTable.datePicker = {
            issueDate: {
                startDate: null,
                endDate: null
            },
            orderDate: {
                startDate: null,
                endDate: null
            },
            options: {
                singleDatePicker: true
            },
            resetIssueDate: {
                start: function() { vm.notesTable.datePicker.issueDate.startDate = null; },
                end: function() { vm.notesTable.datePicker.issueDate.endDate = null; }
            },
            resetOrderDate: {
                start: function() { vm.notesTable.datePicker.orderDate.startDate = null; },
                end: function() { vm.notesTable.datePicker.orderDate.endDate = null; }
            }
        };

        $scope.$watch('vm.notesTable.datePicker.issueDate.startDate', function() {
            GridTableUtil.applyDateFilter(
                vm.notesTable.datePicker.issueDate.startDate,
                vm.notesTable.datePicker.issueDate.endDate,
                'issueDateToFormatedDate',
                vm.originalData.notes,
                function(filteredData) { vm.notesTable.options.data = filteredData; }
            );
        }, false);

        $scope.$watch('vm.notesTable.datePicker.issueDate.endDate', function() {
            GridTableUtil.applyDateFilter(
                vm.notesTable.datePicker.issueDate.startDate,
                vm.notesTable.datePicker.issueDate.endDate,
                'issueDateToFormatedDate',
                vm.originalData.notes,
                function(filteredData) { vm.notesTable.options.data = filteredData; }
            );
        }, false);

        $scope.$watch('vm.notesTable.datePicker.orderDate.startDate', function() {
            GridTableUtil.applyDateFilter(
                vm.notesTable.datePicker.orderDate.startDate,
                vm.notesTable.datePicker.orderDate.endDate,
                'orderDateToFormatedDate',
                vm.originalData.notes,
                function(filteredData) { vm.notesTable.options.data = filteredData; }
            );
        }, false);

        $scope.$watch('vm.notesTable.datePicker.orderDate.endDate', function() {
            GridTableUtil.applyDateFilter(
                vm.notesTable.datePicker.orderDate.startDate,
                vm.notesTable.datePicker.orderDate.endDate,
                'orderDateToFormatedDate',
                vm.originalData.notes,
                function(filteredData) { vm.notesTable.options.data = filteredData; }
            );
        }, false);

        vm.globalFilterNotes = {
            value: "",
            onChange: function() {
                vm.notesTable.options.data = vm.originalData.notes.filter(
                    NotesTableService.globalFilterFactory(vm.globalFilterNotes.value)
                );
            }
        };

        vm.notesTable.options = NotesTableService.options;

        /**
         * Order button
         */

        vm.order = OrderLoansModalService.orderModal;
    }
})();