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

    LoansController.$inject = ['LoansService', 'uiGridConstants', '$uibModal', '$filter', '$scope'];

    function LoansController(LoansService, uiGridConstants, $uibModal, $filter, $scope) {
        var vm = this;

        // Hardcoded since we don't really manage this for now
        vm.investorId = 'BlackRock';

        vm.loansTable = { options: {} };
        vm.originalData = {};

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
                vm.loansTable.options.data = vm.originalData.loans.filter(function(loanObj) {
                    var filter = vm.globalFilter.value;
                    return String( loanObj.id ).startsWith( filter ) ||
                        String( loanObj.originator ).startsWith( filter ) ||
                        String( loanObj.listDToFormatedDate ).startsWith( filter ) ||
                        String( loanObj.loanAmount ).startsWith( filter ) ||
                        String( loanObj.fundedAmount ).startsWith( filter ) ||
                        String( loanObj.term ).startsWith( filter ) ||
                        String( loanObj.intRate ).startsWith( filter ) ||
                        String( loanObj.purpose ).startsWith( filter );
                });
            }
        };

        vm.loansTable.pieChartOptions = {
            fill: ["#00b494", "#d7d7d7"],
            width: 50
        };

        vm.highlightFilteredHeader = function( row, rowRenderIndex, col ) {
            if ( col.filters[0].term ) {
                return 'header-filtered';
            } else {
                return '';
            }
        };

        function applyDateFilter(startDateTerm, endDateTerm, filterKey, originalData, callback) {
            var data = originalData;

            var gt = function(cellDate, filterDate) { return cellDate >= filterDate; };
            var lt = function(cellDate, filterDate) { return cellDate <= filterDate; };

            data = dateFilter(gt, startDateTerm, data);
            data = dateFilter(lt, endDateTerm, data);

            callback(data);

            function dateFilter(filter, newDate, data) {
                if ( newDate !== null ) {
                    var searchDate = newDate.toDate();
                    return data.filter(function(loanObj) {
                        var cellDate = parseEuDate(loanObj[filterKey]);

                        return filter(cellDate, searchDate);
                    });
                }
                else {
                    return data;
                }
            }

            function parseEuDate(str) {
                var parts = str.split("/");
                return new Date(parseInt(parts[2], 10),
                    parseInt(parts[1], 10) - 1,
                    parseInt(parts[0], 10));
            }
        }

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
            applyDateFilter(
                vm.loansTable.datePicker.date.startDate,
                vm.loansTable.datePicker.date.endDate,
                'listDToFormatedDate',
                vm.originalData.loans,
                function(filteredData) { vm.loansTable.options.data = filteredData; });
        }, false);

        $scope.$watch('vm.loansTable.datePicker.date.endDate', function() {
            applyDateFilter(
                vm.loansTable.datePicker.date.startDate,
                vm.loansTable.datePicker.date.endDate,
                'listDToFormatedDate',
                vm.originalData.loans,
                function(filteredData) { vm.loansTable.options.data = filteredData; });
        }, false);

        vm.loansTable.options = {
            enableColumnMenus: false,
            enableSorting: true,
            enableFiltering: true,
            columnDefs: [
                {
                    field: 'originator',
                    filter: {
                        condition: function(searchTerm, cellValue) {
                            var searchTerms = searchTerm.split(',').map(function(search) { return search.trim(); });
                            for (var i in searchTerms) {
                                if ( searchTerms.hasOwnProperty(i) ) {
                                    if (cellValue.startsWith(searchTerms[i])) return true;
                                }
                            }
                            return false;
                        },
                        placeholder: 'ex: "Prosper" or "Lending Club, Prosper"'
                    }
                },
                {
                    field: 'id',
                    displayName: 'Listing Id',
                    headerCellClass: vm.highlightFilteredHeader
                },
                {
                    field: 'listD',
                    displayName: 'Listed',
                    headerCellClass: vm.highlightFilteredHeader,
                    cellFilter: 'date:"dd/MM/yyyy"',
                    filterCellFiltered: true,
                    type: 'date',
                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div class="row"> <input date-range-picker placeholder="greater than ..." class="date-picker col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.vm.loansTable.datePicker.date.startDate" max="col.grid.appScope.vm.loansTable.datePicker.date.endDate" options="col.grid.appScope.vm.loansTable.datePicker.options" /><button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.loansTable.datePicker.reset.start()"><i class="ui-grid-icon-cancel"></i></button></div> <div class="row"> <input date-range-picker placeholder="less than ..." class="date-picker col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.vm.loansTable.datePicker.date.endDate" min="col.grid.appScope.vm.loansTable.datePicker.date.startDate" options="col.grid.appScope.vm.loansTable.datePicker.options" /><button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.loansTable.datePicker.reset.end()"><i class="ui-grid-icon-cancel"></i></button></div></div>'
                },
                {
                    field: 'loanAmount',
                    displayName: 'Requested',
                    filters: [
                        {
                            condition: uiGridConstants.filter.GREATER_THAN,
                            placeholder: 'greater than'
                        },
                        {
                            condition: uiGridConstants.filter.LESS_THAN,
                            placeholder: 'less than'
                        }
                    ],
                    headerCellClass: vm.highlightFilteredHeader,
                    type: 'number'
                },
                {
                    field: 'fundedAmountPerCenter',
                    displayName: 'Funded',
                    filters: [
                        {
                            condition: uiGridConstants.filter.GREATER_THAN,
                            placeholder: 'greater than (%)'
                        },
                        {
                            condition: uiGridConstants.filter.LESS_THAN,
                            placeholder: 'less than (%)'
                        }
                    ],
                    headerCellClass: vm.highlightFilteredHeader,
                    type: 'number',
                    cellTemplate: "<pie-chart data='row.entity.foundedPie' options='row.grid.appScope.vm.loansTable.pieChartOptions'></pie-chart>"
                },
                {
                    field: 'grade',
                    headerCellClass: vm.highlightFilteredHeader,
                    filter: {
                        condition: function(searchTerm, cellValue) {
                            return searchTerm.split(',').map(function(search) { return search.trim(); }).indexOf(cellValue) >= 0;
                        },
                        placeholder: 'ex: "C" or "D, A"'
                    }
                },
                {
                    field: 'term',
                    filters: [
                        {
                            condition: uiGridConstants.filter.GREATER_THAN,
                            placeholder: 'greater than'
                        },
                        {
                            condition: uiGridConstants.filter.LESS_THAN,
                            placeholder: 'less than'
                        }
                    ],
                    headerCellClass: vm.highlightFilteredHeader,
                    type: 'number'
                },
                {
                    field: 'intRate',
                    displayName: 'Yield',
                    filters: [
                        {
                            condition: uiGridConstants.filter.GREATER_THAN,
                            placeholder: 'greater than'
                        },
                        {
                            condition: uiGridConstants.filter.LESS_THAN,
                            placeholder: 'less than'
                        }
                    ],
                    headerCellClass: vm.highlightFilteredHeader,
                    cellTemplate: '<div class="ui-grid-cell-contents">{{ COL_FIELD }} %</div>',
                    type: 'number'
                },
                {
                    field: 'purpose',
                    headerCellClass: vm.highlightFilteredHeader,
                    filter: {
                        condition: function(searchTerm, cellValue) {
                            var searchTerms = searchTerm.split(',').map(function(search) { return search.trim(); });
                            for (var i in searchTerms) {
                                if ( searchTerms.hasOwnProperty(i) ) {
                                    if (cellValue.startsWith(searchTerms[i])) return true;
                                }
                            }
                            return false;
                        },
                        placeholder: 'ex: "car" or "house, car"'
                    }
                },
                {
                    field: 'id',
                    displayName: 'Order',
                    cellTemplate: "<div class='text-center'><span data-ng-if='row.entity.loanAmount > row.entity.fundedAmount' class='label label-primary' data-ng-click='row.grid.appScope.vm.order(row.entity.id, row.entity.loanAmount, row.entity.fundedAmount, row.entity.originator)'>Add to Order</span><span data-ng-if='row.entity.loanAmount === row.entity.fundedAmount' class='label label-warning' disabled='disabled'>Not available</span></div>",
                    enableFiltering: false
                }
            ]
        };

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
            applyDateFilter(
                vm.notesTable.datePicker.issueDate.startDate,
                vm.notesTable.datePicker.issueDate.endDate,
                'issueDateToFormatedDate',
                vm.originalData.notes,
                function(filteredData) { vm.notesTable.options.data = filteredData; }
            );
        }, false);

        $scope.$watch('vm.notesTable.datePicker.issueDate.endDate', function() {
            applyDateFilter(
                vm.notesTable.datePicker.issueDate.startDate,
                vm.notesTable.datePicker.issueDate.endDate,
                'issueDateToFormatedDate',
                vm.originalData.notes,
                function(filteredData) { vm.notesTable.options.data = filteredData; }
            );
        }, false);

        $scope.$watch('vm.notesTable.datePicker.orderDate.startDate', function() {
            applyDateFilter(
                vm.notesTable.datePicker.orderDate.startDate,
                vm.notesTable.datePicker.orderDate.endDate,
                'orderDateToFormatedDate',
                vm.originalData.notes,
                function(filteredData) { vm.notesTable.options.data = filteredData; }
            );
        }, false);

        $scope.$watch('vm.notesTable.datePicker.orderDate.endDate', function() {
            applyDateFilter(
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
                vm.notesTable.options.data = vm.originalData.notes.filter(function(noteObj) {
                    var filter = vm.globalFilterNotes.value;
                    return String( noteObj.noteId ).startsWith( filter ) ||
                        String( noteObj.originator ).startsWith( filter ) ||
                        String( noteObj.orderDateToFormatedDate ).startsWith( filter ) ||
                        String( noteObj.originalData ).startsWith( filter ) ||
                        String( noteObj.loanAmount ).startsWith( filter ) ||
                        String( noteObj.noteAmount ).startsWith( filter ) ||
                        String( noteObj.term ).startsWith( filter ) ||
                        String( noteObj.interestRate ).startsWith( filter ) ||
                        String( noteObj.purpose ).startsWith( filter );
                });
            }
        };

        vm.notesTable.options = {
            enableColumnMenus: false,
            enableSorting: true,
            enableFiltering: true,
            columnDefs: [
                                {
                    field: 'noteId',
                    displayName: 'Note Id',
                    headerCellClass: vm.highlightFilteredHeader
                },
                {
                    field: 'issueDate',
                    displayName: 'Issue Date',
                    headerCellClass: vm.highlightFilteredHeader,
                    cellFilter: 'date:"dd/MM/yyyy"',
                    filterCellFiltered: true,
                    type: 'date',
                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div class="row"> <input date-range-picker placeholder="greater than ..." class="date-picker col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.vm.notesTable.datePicker.issueDate.startDate" max="col.grid.appScope.vm.notesTable.datePicker.issueDate.endDate" options="col.grid.appScope.vm.loansTable.datePicker.options" /><button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.notesTable.datePicker.resetIssueDate.start()"><i class="ui-grid-icon-cancel"></i></button></div> <div class="row"> <input date-range-picker placeholder="less than ..." class="date-picker col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.vm.notesTable.datePicker.issueDate.endDate" min="col.grid.appScope.vm.notesTable.datePicker.issueDate.startDate" options="col.grid.appScope.vm.notesTable.datePicker.options" /><button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.notesTable.datePicker.resetIssueDate.end()"><i class="ui-grid-icon-cancel"></i></button></div></div>'
                },
                {
                    field: 'orderDate',
                    displayName: 'Order Date',
                    headerCellClass: vm.highlightFilteredHeader,
                    cellFilter: 'date:"dd/MM/yyyy"',
                    filterCellFiltered: true,
                    type: 'date',
                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div class="row"> <input date-range-picker placeholder="greater than ..." class="date-picker col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.vm.notesTable.datePicker.orderDate.startDate" max="col.grid.appScope.vm.notesTable.datePicker.orderDate.endDate" options="col.grid.appScope.vm.notesTable.datePicker.options" /><button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.notesTable.datePicker.resetOrderDate.start()"><i class="ui-grid-icon-cancel"></i></button></div> <div class="row"> <input date-range-picker placeholder="less than ..." class="date-picker col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.vm.notesTable.datePicker.orderDate.endDate" min="col.grid.appScope.vm.notesTable.datePicker.orderDate.startDate" options="col.grid.appScope.vm.notesTable.datePicker.options" /><button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.notesTable.datePicker.resetOrderDate.end()"><i class="ui-grid-icon-cancel"></i></button></div></div>'
                },
                {
                    field: 'loanAmount',
                    displayName: 'Requested',
                    filters: [
                        {
                            condition: uiGridConstants.filter.GREATER_THAN,
                            placeholder: 'greater than'
                        },
                        {
                            condition: uiGridConstants.filter.LESS_THAN,
                            placeholder: 'less than'
                        }
                    ],
                    headerCellClass: vm.highlightFilteredHeader,
                    type: 'number'
                },
                {
                    field: 'noteAmount',
                    displayName: 'Note Amount',
                    filters: [
                        {
                            condition: uiGridConstants.filter.GREATER_THAN,
                            placeholder: 'greater than'
                        },
                        {
                            condition: uiGridConstants.filter.LESS_THAN,
                            placeholder: 'less than'
                        }
                    ],
                    headerCellClass: vm.highlightFilteredHeader,
                    type: 'number'
                },
                {
                    field: 'grade',
                    headerCellClass: vm.highlightFilteredHeader,
                    filter: {
                        condition: function(searchTerm, cellValue) {
                            return searchTerm.split(',').map(function(search) { return search.trim(); }).indexOf(cellValue) >= 0;
                        },
                        placeholder: 'ex: "C" or "D, A"'
                    }
                },
                {
                    field: 'term',
                    filters: [
                        {
                            condition: uiGridConstants.filter.GREATER_THAN,
                            placeholder: 'greater than'
                        },
                        {
                            condition: uiGridConstants.filter.LESS_THAN,
                            placeholder: 'less than'
                        }
                    ],
                    headerCellClass: vm.highlightFilteredHeader,
                    type: 'number'
                },
                {
                    field: 'interestRate',
                    displayName: 'Yield',
                    filters: [
                        {
                            condition: uiGridConstants.filter.GREATER_THAN,
                            placeholder: 'greater than'
                        },
                        {
                            condition: uiGridConstants.filter.LESS_THAN,
                            placeholder: 'less than'
                        }
                    ],
                    headerCellClass: vm.highlightFilteredHeader,
                    cellTemplate: '<div class="ui-grid-cell-contents">{{ COL_FIELD }} %</div>',
                    type: 'number'
                },
                {
                    field: 'purpose',
                    headerCellClass: vm.highlightFilteredHeader,
                    filter: {
                        condition: function(searchTerm, cellValue) {
                            var searchTerms = searchTerm.split(',').map(function(search) { return search.trim(); });
                            for (var i in searchTerms) {
                                if ( searchTerms.hasOwnProperty(i) ) {
                                    if (cellValue.startsWith(searchTerms[i])) return true;
                                }
                            }
                            return false;
                        },
                        placeholder: 'ex: "car" or "house, car"'
                    }
                }
            ]
        };

        /**
         * Order button
         */

        vm.order = function(loanId, loanAmount, fundedAmount, originator) {
            var modalInstance = $uibModal.open({
                templateUrl: 'view/modal-order',
                controller: OrderModalInstanceCtrl,
                resolve: {
                    loanId: function() { return loanId; },
                    loanAmount: function() { return loanAmount; },
                    fundedAmount: function() { return fundedAmount; },
                    originator: function() { return originator; }
                }
            });
        };

        function OrderModalInstanceCtrl($scope, $modalInstance, loanId, loanAmount, fundedAmount, originator, SweetAlert, LoansService, minInvestByOriginator) {
            $scope.loanId = loanId;
            $scope.loanAmount = loanAmount;
            $scope.fundedAmount = fundedAmount;
            $scope.originator = originator;

            var originatorMinInvest = minInvestByOriginator[toCamelCase(originator)];

            $scope.slider = {
                min: originatorMinInvest,
                max: loanAmount - fundedAmount,
                step: 0.01,
                value: parseInt(originatorMinInvest) + 1
            };

            $scope.loading = false;

            $scope.conditions = {
                valueGtRemaining: function() {
                    return $scope.slider.value > $scope.slider.max;
                },
                valueLtMin: function() {
                    return $scope.slider.value <= originatorMinInvest;
                },
                notNumeric: function() {
                    return !isNumeric($scope.slider.value);
                }
            };

            $scope.disabled = function() {
                return $scope.conditions.valueGtRemaining() ||
                    $scope.conditions.valueLtMin() ||
                    $scope.conditions.notNumeric();
            };

            $scope.ok = function () {
                $scope.loading = true;
                LoansService.submitOrder(vm.investorId, loanId, $scope.slider.value).then( orderSuccess, orderError );
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            function closeModal() {
                $scope.loading = false;
                $modalInstance.close();
            }

            function orderSuccess() {
                SweetAlert.swal(
                    "Done !",
                    "Your order has been placed !",
                    "success"
                );

                closeModal();
            }

            function orderError() {
                SweetAlert.swal(
                    "Oops...",
                    "Something went wrong !",
                    "error"
                );

                closeModal();
            }

            function isNumeric(n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            }

            function toCamelCase(str) {
                return str
                .replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
                .replace(/\s/g, '')
                .replace(/^(.)/, function($1) { return $1.toLowerCase(); });
            }
        }
    }
})();