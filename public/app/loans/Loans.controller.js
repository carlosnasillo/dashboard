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

    LoansController.$inject = ['LoansService', 'uiGridConstants'];

    function LoansController(LoansService, uiGridConstants) {
        var vm = this;

        vm.loansTable = { options: {} };

        LoansService.loansAvailable().success(function(data) {
            vm.loansTable.options.data = data.loans;
        });

        vm.highlightFilteredHeader = function( row, rowRenderIndex, col ) {
            if ( col.filters[0].term ) {
                return 'header-filtered';
            } else {
                return '';
            }
        };

        var minMaxFilters = [
            {
                condition: uiGridConstants.filter.GREATER_THAN,
                placeholder: 'greater than'
            },
            {
                condition: uiGridConstants.filter.LESS_THAN,
                placeholder: 'less than'
            }
        ];

        vm.loansTable.options = {
            enableColumnMenus: false,
            enableSorting: true,
            enableFiltering: true,
            columnDefs: [
                {
                    field: 'id',
                    displayName: 'Listing Id',
                    headerCellClass: vm.highlightFilteredHeader
                },
                {
                    field: 'listD',
                    displayName: 'Listed',
                    headerCellClass: vm.highlightFilteredHeader,
                    cellFilter: 'date:"dd/MM/yyyy"'
                },
                {
                    field: 'loanAmount',
                    displayName: 'Requested',
                    filters: minMaxFilters,
                    headerCellClass: vm.highlightFilteredHeader
                },
                {
                    field: 'fundedAmount',
                    displayName: 'Founded',
                    filters: minMaxFilters,
                    headerCellClass: vm.highlightFilteredHeader
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
                    filters: minMaxFilters,
                    headerCellClass: vm.highlightFilteredHeader
                },
                {
                    field: 'purpose',
                    headerCellClass: vm.highlightFilteredHeader
                }
            ]
        }
    }
})();