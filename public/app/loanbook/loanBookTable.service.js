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
* Created on 19/11/2015
*/

(function() {
    'use strict';

    angular
        .module('app')
        .factory('LoanBookTableService', LoanBookTableService);


    LoanBookTableService.$inject = ['GridTableUtil'];

    function LoanBookTableService(GridTableUtil) {
        var tableOptions = {
            enableColumnMenus: false,
            enableSorting: true,
            enableFiltering: true,
            enableRowSelection: true,
            multiSelect: true,
            columnDefs: [
                {
                    field: 'originator',
                    headerCellClass: 'text-center',
                    filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('ex: Lending Club, ...', 'vm.loanBookTable.filters.originator', 'vm.loanBookTable.filters.filterLoans()')
                },
                {
                    field: 'status',
                    headerCellClass: 'text-center',
                    filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('ex: open, ...', 'vm.loanBookTable.filters.status', 'vm.loanBookTable.filters.filterLoans()')
                },
                {
                    field: 'grade',
                    headerCellClass: 'text-center',
                    filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('ex: C, A, ...', 'vm.loanBookTable.filters.grade', 'vm.loanBookTable.filters.filterLoans()')
                },
                {
                    field: 'purpose',
                    headerCellClass: 'text-center',
                    filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('ex: house, ...', 'vm.loanBookTable.filters.purpose', 'vm.loanBookTable.filters.filterLoans()')
                },
                {
                    field: 'sector',
                    headerCellClass: 'text-center',
                    filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('ex: wholesale, ...', 'vm.loanBookTable.filters.sector', 'vm.loanBookTable.filters.filterLoans()')
                },
                {
                    field: 'type',
                    headerCellClass: 'text-center',
                    filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('ex: limited', 'vm.loanBookTable.filters.type', 'vm.loanBookTable.filters.filterLoans()')
                },
                {
                    field: 'region',
                    headerCellClass: 'text-center',
                    filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('ex: north, west', 'vm.loanBookTable.filters.region', 'vm.loanBookTable.filters.filterLoans()')
                },
                {
                    field: 'amount',
                    headerCellClass: 'text-center',
                    filterHeaderTemplate: GridTableUtil.doubleNumberFilterTemplateFactory('vm.loanBookTable.filters.amount', 'vm.loanBookTable.filters.filterLoans()')
                },
                {
                    field: 'interest',
                    headerCellClass: 'text-center',
                    cellFilter: 'percentage:2',
                    filterHeaderTemplate: GridTableUtil.doublePercentFilterTemplateFactory('vm.loanBookTable.filters.interestPerCent', 'vm.loanBookTable.filters.filterLoans()')
                },
                {
                    field: 'term',
                    headerCellClass: 'text-center',
                    filterHeaderTemplate: GridTableUtil.doubleNumberFilterTemplateFactory('vm.loanBookTable.filters.term', 'vm.loanBookTable.filters.filterLoans()')
                },
                {
                    field: 'loanDate',
                    headerCellClass: 'text-center',
                    filterHeaderTemplate: GridTableUtil.dateFilterTemplateFactory('vm.loanBookTable.filters.loanDate')
                },
                {
                    field: 'security',
                    headerCellClass: 'text-center',
                    filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('', 'vm.loanBookTable.filters.security', 'vm.loanBookTable.filters.filterLoans()')
                },
                {
                    field: 'id',
                    headerCellClass: 'text-center',
                    displayName: 'RFQ',
                    cellTemplate: "<div class='ui-grid-cell-contents ng-binding ng-scope'><div class='text-center'><span class='label label-primary' data-ng-click='row.grid.appScope.vm.order(row.entity, row.grid.appScope.vm.loanBookTable.gridApi.selection.getSelectedRows())'>RFQ</span></div></div>",
                    enableFiltering: false
                }
            ]
        };

        return {
            options: tableOptions
        };
    }
})();
