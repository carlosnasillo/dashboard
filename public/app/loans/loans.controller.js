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

        vm.loansTable.filters = {
            filterLoans: function() {
                vm.loansTable.options.data = vm.originalData.loans.filter(function(loanObj) {
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
                    function(filteredData) { vm.loansTable.options.data = filteredData; });
            },
            identifier: {
                value: "",
                reset: function() {
                    vm.loansTable.filters.identifier.value = "";
                    vm.loansTable.filters.filterLoans();
                },
                filterFn: function(loanObj) {
                    var filter = vm.loansTable.filters.identifier.value;
                    if (filter) {
                        return String( loanObj.id ).startsWith( filter );
                    }
                    else {
                        return true;
                    }
                }
            },
            originator: {
                value: "",
                reset: function() {
                    vm.loansTable.filters.originator.value = "";
                    vm.loansTable.filters.filterLoans();
                },
                filterFn: function(loanObj) {
                    var searchTerm = vm.loansTable.filters.originator.value;
                    if (searchTerm) {
                        var searchTerms = searchTerm.split(',').map(function(search) { return search.trim(); });
                        for (var i in searchTerms) {
                            if ( searchTerms.hasOwnProperty(i) && searchTerms[i].length > 0) {
                                if (loanObj.originator.startsWith(searchTerms[i])) return true;
                            }
                        }
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            },
            listD: {
                start: {
                    value: null,
                    formattedValue: function() {
                        return GridTableUtil.formatValue(
                            vm.loansTable.filters.listD.start.value,
                            vm.loansTable.filters.listD.end.value,
                            function(value) { return $filter('date')(value.toDate(), 'dd/MM/yyyy');}
                        );
                    },
                    reset: function() { vm.loansTable.filters.listD.start.value = null; },
                    filterFn: function() {
                        GridTableUtil.applyDateFilter(
                            vm.loansTable.filters.listD.start.value,
                            vm.loansTable.filters.listD.end.value,
                            'listDtoFormattedDate',
                            vm.originalData.loans,
                            function(filteredData) { vm.loansTable.options.data = filteredData; });
                    }
                },
                end: {
                    value: null,
                    formattedValue: function() {
                        return GridTableUtil.formatValue(
                            vm.loansTable.filters.listD.end.value,
                            vm.loansTable.filters.listD.start.value,
                            function(value) { return $filter('date')(value.toDate(), 'dd/MM/yyyy'); }
                        );
                    },
                    reset: function() { vm.loansTable.filters.listD.end.value= null; },
                    filterFn: function() {
                        GridTableUtil.applyDateFilter(
                            vm.loansTable.filters.listD.start.value,
                            vm.loansTable.filters.listD.end.value,
                            'listDtoFormattedDate',
                            vm.originalData.loans,
                            function(filteredData) { vm.loansTable.options.data = filteredData; });
                    }
                },
                options: {
                    singleDatePicker: true
                }
            },
            loanAmount: {
                start: {
                    value: "",
                    formattedValue: function() {
                        return GridTableUtil.formatValue(
                            vm.loansTable.filters.loanAmount.start.value,
                            vm.loansTable.filters.loanAmount.end.value
                        );
                    },
                    reset: function() {
                        vm.loansTable.filters.loanAmount.start.value = "";
                        vm.loansTable.filters.filterLoans();
                    },
                    filterFn: function(loanObj) {
                        var filter = vm.loansTable.filters.loanAmount.start.value;
                        if (filter) {
                            return loanObj.loanAmount > filter;
                        }
                        else {
                            return true;
                        }
                    }
                },
                end: {
                    value: "",
                    formattedValue: function() {
                        return GridTableUtil.formatValue(
                            vm.loansTable.filters.loanAmount.end.value,
                            vm.loansTable.filters.loanAmount.start.value
                        );
                    },
                    reset: function() {
                        vm.loansTable.filters.loanAmount.end.value = "";
                        vm.loansTable.filters.filterLoans();
                    },
                    filterFn: function(loanObj) {
                        var filter = vm.loansTable.filters.loanAmount.end.value;
                        if (filter) {
                            return loanObj.loanAmount < filter;
                        }
                        else {
                            return true;
                        }
                    }
                }
            },
            fundedAmountPerCent: {
                start: {
                    value: "",
                    formattedValue: function() {
                        return GridTableUtil.formatValue(
                            vm.loansTable.filters.fundedAmountPerCent.start.value,
                            vm.loansTable.filters.fundedAmountPerCent.end.value,
                            function(value) { return value + " %"; }
                        );
                    },
                    reset: function() {
                        vm.loansTable.filters.fundedAmountPerCent.start.value = "";
                        vm.loansTable.filters.filterLoans();
                    },
                    filterFn: function(loanObj) {
                        var filter = vm.loansTable.filters.fundedAmountPerCent.start.value;
                        if (filter) {
                            return loanObj.fundedAmountPerCent > filter;
                        }
                        else {
                            return true;
                        }
                    }
                },
                end: {
                    value: "",
                    formattedValue: function() {
                        return GridTableUtil.formatValue(
                            vm.loansTable.filters.fundedAmountPerCent.end.value,
                            vm.loansTable.filters.fundedAmountPerCent.start.value,
                            function(value) { return value + " %"; }
                        );
                    },
                    reset: function() {
                        vm.loansTable.filters.fundedAmountPerCent.end.value = "";
                        vm.loansTable.filters.filterLoans();
                    },
                    filterFn: function(loanObj) {
                        var filter = vm.loansTable.filters.fundedAmountPerCent.end.value;
                        if (filter) {
                            return loanObj.fundedAmountPerCent < filter;
                        }
                        else {
                            return true;
                        }
                    }
                }
            },
            grade: {
                value: "",
                reset: function() {
                    vm.loansTable.filters.grade.value = "";
                    vm.loansTable.filters.filterLoans();
                },
                filterFn: function(loanObj) {
                    var filter = vm.loansTable.filters.grade.value;
                    if (filter) {
                        return filter.split(',').map(function(search) { return search.trim(); }).indexOf(loanObj.grade) >= 0;
                    }
                    else {
                        return true;
                    }
                }
            },
            term: {
                start: {
                    value: "",
                    formattedValue: function() {
                        return GridTableUtil.formatValue(
                            vm.loansTable.filters.term.start.value,
                            vm.loansTable.filters.term.end.value
                        );
                    },
                    reset: function() {
                        vm.loansTable.filters.term.start.value = "";
                        vm.loansTable.filters.filterLoans();
                    },
                    filterFn: function(loanObj) {
                        var filter = vm.loansTable.filters.term.start.value;
                        if (filter) {
                            return loanObj.term > filter;
                        }
                        else {
                            return true;
                        }
                    }
                },
                end: {
                    value: "",
                    formattedValue: function() {
                        return GridTableUtil.formatValue(
                            vm.loansTable.filters.term.end.value,
                            vm.loansTable.filters.term.start.value
                        );
                    },
                    reset: function() {
                        vm.loansTable.filters.term.end.value = "";
                        vm.loansTable.filters.filterLoans();
                    },
                    filterFn: function(loanObj) {
                        var filter = vm.loansTable.filters.term.end.value;
                        if (filter) {
                            return loanObj.term < filter;
                        }
                        else {
                            return true;
                        }
                    }
                }
            },
            intRate: {
                start: {
                    value: "",
                    formattedValue: function() {
                        return GridTableUtil.formatValue(
                            vm.loansTable.filters.intRate.start.value,
                            vm.loansTable.filters.intRate.end.value,
                            function(value) { return value + " %"; }
                        );
                    },
                    reset: function() {
                        vm.loansTable.filters.intRate.start.value = "";
                        vm.loansTable.filters.filterLoans();
                    },
                    filterFn: function(loanObj) {
                        var filter = vm.loansTable.filters.intRate.start.value;
                        if (filter) {
                            return loanObj.intRate > filter;
                        }
                        else {
                            return true;
                        }
                    }
                },
                end: {
                    value: "",
                    formattedValue: function() {
                        return GridTableUtil.formatValue(
                            vm.loansTable.filters.intRate.end.value,
                            vm.loansTable.filters.intRate.start.value,
                            function(value) { return value + " %"; }
                        );
                    },
                    reset: function() {
                        vm.loansTable.filters.intRate.end.value = "";
                        vm.loansTable.filters.filterLoans();
                    },
                    filterFn: function(loanObj) {
                        var filter = vm.loansTable.filters.intRate.end.value;
                        if (filter) {
                            return loanObj.intRate < filter;
                        }
                        else {
                            return true;
                        }
                    }
                }
            },
            purpose: {
                value: "",
                reset: function() {
                    vm.loansTable.filters.purpose.value = "";
                    vm.loansTable.filters.filterLoans();
                },
                filterFn: function(loanObj) {
                    var filter = vm.loansTable.filters.purpose.value;

                    if (filter) {
                        var searchTerms = filter.split(',').map(function(search) { return search.trim(); });
                        for (var i in searchTerms) {
                            if ( searchTerms.hasOwnProperty(i) && searchTerms[i].length > 0) {
                                if (loanObj.purpose.startsWith(searchTerms[i])) return true;
                            }
                        }
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            }
        };

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

            vm.originalData.notes = vm.notesTable.options.data;
        });

        vm.notesTable.filters = {
            filterNotes: function () {
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
            },
            noteId: {
                value: "",
                reset: function() {
                    vm.notesTable.filters.noteId.value = "";
                    vm.notesTable.filters.filterNotes();
                },
                filterFn: function(noteObj) {
                    var filter = vm.notesTable.filters.noteId.value;
                    if (filter) {
                        return String( noteObj.noteId ).startsWith( filter );
                    }
                    else {
                        return true;
                    }
                }
            },
            issueDate: {
                start: {
                    value: null,
                    formattedValue: function() {
                        return GridTableUtil.formatValue(
                            vm.notesTable.filters.issueDate.start.value,
                            vm.notesTable.filters.issueDate.end.value,
                            function(value) { return $filter('date')(value.toDate(), 'dd/MM/yyyy'); }
                        );
                    },
                    reset: function() { vm.notesTable.filters.issueDate.start.value = null; },
                    filterFn: function() {
                        GridTableUtil.applyDateFilter(
                            vm.notesTable.filters.issueDate.start.value,
                            vm.notesTable.filters.issueDate.end.value,
                            'issueDatetoFormattedDate',
                            vm.originalData.notes,
                            function(filteredData) { vm.notesTable.options.data = filteredData; });
                    }
                },
                end: {
                    value: null,
                    formattedValue: function() {
                        return GridTableUtil.formatValue(
                            vm.notesTable.filters.issueDate.end.value,
                            vm.notesTable.filters.issueDate.start.value,
                            function(value) { return $filter('date')(value.toDate(), 'dd/MM/yyyy'); }
                        );
                    },
                    reset: function() { vm.notesTable.filters.issueDate.end.value= null; },
                    filterFn: function() {
                        GridTableUtil.applyDateFilter(
                            vm.notesTable.filters.issueDate.start.value,
                            vm.notesTable.filters.issueDate.end.value,
                            'issueDatetoFormattedDate',
                            vm.originalData.notes,
                            function(filteredData) { vm.notesTable.options.data = filteredData; });
                    }
                },
                options: {
                    singleDatePicker: true
                }
            },
            orderDate: {
                start: {
                    value: null,
                    formattedValue: function() {
                        return GridTableUtil.formatValue(
                            vm.notesTable.filters.orderDate.start.value,
                            vm.notesTable.filters.orderDate.end.value,
                            function(value) { return $filter('date')(value.toDate(), 'dd/MM/yyyy'); }
                        );
                    },
                    reset: function() { vm.notesTable.filters.orderDate.start.value = null; },
                    filterFn: function() {
                        GridTableUtil.applyDateFilter(
                            vm.notesTable.filters.orderDate.start.value,
                            vm.notesTable.filters.orderDate.end.value,
                            'orderDatetoFormattedDate',
                            vm.originalData.notes,
                            function(filteredData) { vm.notesTable.options.data = filteredData; });
                    }
                },
                end: {
                    value: null,
                    formattedValue: function() {
                        return GridTableUtil.formatValue(
                            vm.notesTable.filters.orderDate.end.value,
                            vm.notesTable.filters.orderDate.start.value,
                            function(value) { return $filter('date')(value.toDate(), 'dd/MM/yyyy'); }
                        );
                    },
                    reset: function() { vm.notesTable.filters.orderDate.end.value= null; },
                    filterFn: function() {
                        GridTableUtil.applyDateFilter(
                            vm.notesTable.filters.orderDate.start.value,
                            vm.notesTable.filters.orderDate.end.value,
                            'orderDatetoFormattedDate',
                            vm.originalData.notes,
                            function(filteredData) { vm.notesTable.options.data = filteredData; });
                    }
                },
                options: {
                    singleDatePicker: true
                }
            },
            loanAmount: {
                start: {
                    value: "",
                    formattedValue: function() {
                        return GridTableUtil.formatValue(
                            vm.notesTable.filters.loanAmount.start.value,
                            vm.notesTable.filters.loanAmount.end.value
                        );
                    },
                    reset: function() {
                        vm.notesTable.filters.loanAmount.start.value = "";
                        vm.notesTable.filters.filterNotes();
                    },
                    filterFn: function(noteObj) {
                        var filter = vm.notesTable.filters.loanAmount.start.value;
                        if (filter) {
                            return noteObj.loanAmount > filter;
                        }
                        else {
                            return true;
                        }
                    }
                },
                end: {
                    value: "",
                    formattedValue: function() {
                        return GridTableUtil.formatValue(
                            vm.notesTable.filters.loanAmount.end.value,
                            vm.notesTable.filters.loanAmount.start.value
                        );
                    },
                    reset: function() {
                        vm.notesTable.filters.loanAmount.end.value = "";
                        vm.notesTable.filters.filterNotes();
                    },
                    filterFn: function(noteObj) {
                        var filter = vm.notesTable.filters.loanAmount.end.value;
                        if (filter) {
                            return noteObj.loanAmount < filter;
                        }
                        else {
                            return true;
                        }
                    }
                }
            },
            noteAmount: {
                start: {
                    value: "",
                    formattedValue: function() {
                        return GridTableUtil.formatValue(
                            vm.notesTable.filters.noteAmount.start.value,
                            vm.notesTable.filters.noteAmount.end.value
                        );
                    },
                    reset: function() {
                        vm.notesTable.filters.noteAmount.start.value = "";
                        vm.notesTable.filters.filterNotes();
                    },
                    filterFn: function(noteObj) {
                        var filter = vm.notesTable.filters.noteAmount.start.value;
                        if (filter) {
                            return noteObj.noteAmount > filter;
                        }
                        else {
                            return true;
                        }
                    }
                },
                end: {
                    value: "",
                    formattedValue: function() {
                        return GridTableUtil.formatValue(
                            vm.notesTable.filters.noteAmount.end.value,
                            vm.notesTable.filters.noteAmount.start.value
                        );
                    },
                    reset: function() {
                        vm.notesTable.filters.noteAmount.end.value = "";
                        vm.notesTable.filters.filterNotes();
                    },
                    filterFn: function(noteObj) {
                        var filter = vm.notesTable.filters.noteAmount.end.value;
                        if (filter) {
                            return noteObj.noteAmount < filter;
                        }
                        else {
                            return true;
                        }
                    }
                }
            },
            grade: {
                value: "",
                reset: function() {
                    vm.notesTable.filters.grade.value = "";
                    vm.notesTable.filters.filterNotes();
                },
                filterFn: function(noteObj) {
                    var filter = vm.notesTable.filters.grade.value;
                    if (filter) {
                        return filter.split(',').map(function(search) { return search.trim(); }).indexOf(noteObj.grade) >= 0;
                    }
                    else {
                        return true;
                    }
                }
            },
            term: {
                start: {
                    value: "",
                    formattedValue: function() {
                        return GridTableUtil.formatValue(
                            vm.notesTable.filters.term.start.value,
                            vm.notesTable.filters.term.end.value
                        );
                    },
                    reset: function() {
                        vm.notesTable.filters.term.start.value = "";
                        vm.notesTable.filters.filterNotes();
                    },
                    filterFn: function(noteObj) {
                        var filter = vm.notesTable.filters.term.start.value;
                        if (filter) {
                            return noteObj.term > filter;
                        }
                        else {
                            return true;
                        }
                    }
                },
                end: {
                    value: "",
                    formattedValue: function() {
                        return GridTableUtil.formatValue(
                            vm.notesTable.filters.term.end.value,
                            vm.notesTable.filters.term.start.value
                        );
                    },
                    reset: function() {
                        vm.notesTable.filters.term.end.value = "";
                        vm.notesTable.filters.filterNotes();
                    },
                    filterFn: function(noteObj) {
                        var filter = vm.notesTable.filters.term.end.value;
                        if (filter) {
                            return noteObj.term < filter;
                        }
                        else {
                            return true;
                        }
                    }
                }
            },
            interestRate: {
                start: {
                    value: "",
                    formattedValue: function() {
                        return GridTableUtil.formatValue(
                            vm.notesTable.filters.interestRate.start.value,
                            vm.notesTable.filters.interestRate.end.value,
                            function(value) { return value + ' %'; }
                        );
                    },
                    reset: function() {
                        vm.notesTable.filters.interestRate.start.value = "";
                        vm.notesTable.filters.filterNotes();
                    },
                    filterFn: function(noteObj) {
                        var filter = vm.notesTable.filters.interestRate.start.value;
                        if (filter) {
                            return noteObj.interestRate > filter;
                        }
                        else {
                            return true;
                        }
                    }
                },
                end: {
                    value: "",
                    formattedValue: function() {
                        return GridTableUtil.formatValue(
                            vm.notesTable.filters.interestRate.end.value,
                            vm.notesTable.filters.interestRate.start.value,
                            function(value) { return value + ' %'; }
                        );
                    },
                    reset: function() {
                        vm.notesTable.filters.interestRate.end.value = "";
                        vm.notesTable.filters.filterNotes();
                    },
                    filterFn: function(noteObj) {
                        var filter = vm.notesTable.filters.interestRate.end.value;
                        if (filter) {
                            return noteObj.interestRate < filter;
                        }
                        else {
                            return true;
                        }
                    }
                }
            },
            purpose: {
                value: "",
                reset: function() {
                    vm.notesTable.filters.purpose.value = "";
                    vm.notesTable.filters.filterNotes();
                },
                filterFn: function(notesObj) {
                    var filter = vm.notesTable.filters.purpose.value;

                    if (filter) {
                        var searchTerms = filter.split(',').map(function(search) { return search.trim(); });
                        for (var i in searchTerms) {
                            if ( searchTerms.hasOwnProperty(i) && searchTerms[i].length > 0) {
                                if (notesObj.purpose.startsWith(searchTerms[i])) return true;
                            }
                        }
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            }
        };

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