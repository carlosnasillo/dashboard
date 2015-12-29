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
        .factory('LoansTableService', LoansTableService);


    LoansTableService.$inject = ['GridTableUtil'];

    function LoansTableService(GridTableUtil) {
        var tableOptions = {
            enableColumnMenus: false,
            enableSorting: true,
            enableFiltering: true,
            columnDefs: [
                {
                    field: 'originator',
                    filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('ex: Lending Club, ...', 'vm.loansTable.filters.originator', 'vm.loansTable.filters.filterLoans()')
                },
                {
                    field: 'id',
                    displayName: 'Listing Id',
                    filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('', 'vm.loansTable.filters.identifier', 'vm.loansTable.filters.filterLoans()')
                },
                {
                    field: 'listD',
                    displayName: 'Listed',
                    cellFilter: 'date:"dd/MM/yyyy"',
                    filterCellFiltered: true,
                    type: 'date',
                    filterHeaderTemplate: GridTableUtil.dateFilterTemplateFactory('vm.loansTable.filters.listD')
                },
                {
                    field: 'loanAmount',
                    displayName: 'Requested',
                    type: 'number',
                    filterHeaderTemplate: GridTableUtil.doubleNumberFilterTemplateFactory('vm.loansTable.filters.loanAmount')
                },
                {
                    field: 'fundedAmountPerCenter',
                    displayName: 'Funded',
                    filterHeaderTemplate: GridTableUtil.doubleNumberFilterTemplateFactory('vm.loansTable.filters.fundedAmountPerCent'),
                    type: 'number',
                    cellTemplate: "<pie-chart data='row.entity.foundedPie' options='row.grid.appScope.vm.loansTable.pieChartOptions'></pie-chart>"
                },
                {
                    field: 'grade',
                    filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('ex: A, C', 'vm.loansTable.filters.grade', 'vm.loansTable.filters.filterLoans()')
                },
                {
                    field: 'term',
                    filterHeaderTemplate: GridTableUtil.doubleNumberFilterTemplateFactory('vm.loansTable.filters.term'),
                    type: 'number'
                },
                {
                    field: 'intRate',
                    displayName: 'Yield',
                    filterHeaderTemplate: GridTableUtil.doublePercentFilterTemplateFactory('vm.loansTable.filters.intRate'),
                    cellTemplate: '<div class="ui-grid-cell-contents">{{ COL_FIELD }} %</div>',
                    type: 'number'
                },
                {
                    field: 'purpose',
                    filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('ex: house, car', 'vm.loansTable.filters.purpose', 'vm.loansTable.filters.filterLoans()')
                },
                {
                    field: 'id',
                    displayName: 'Order',
                    cellTemplate: "<div class='text-center'><span data-ng-if='row.entity.loanAmount > row.entity.fundedAmount' class='label label-primary' data-ng-click='row.grid.appScope.vm.order(row.entity.id, row.entity.loanAmount, row.entity.fundedAmount, row.entity.originator, row.grid.appScope.vm.investorId)'>Add to Order</span><span data-ng-if='row.entity.loanAmount === row.entity.fundedAmount' class='label label-warning' disabled='disabled'>Not available</span></div>",
                    enableFiltering: false
                }
            ]
        };

        var globalFilterFactory = function(filterValue) {
            return function(loanObj) {
                var filter = filterValue;
                return String( loanObj.id ).startsWith( filter ) ||
                    String( loanObj.originator ).startsWith( filter ) ||
                    String( loanObj.listDtoFormattedDate ).startsWith( filter ) ||
                    String( loanObj.loanAmount ).startsWith( filter ) ||
                    String( loanObj.fundedAmount ).startsWith( filter ) ||
                    String( loanObj.term ).startsWith( filter ) ||
                    String( loanObj.intRate ).startsWith( filter ) ||
                    String( loanObj.purpose ).startsWith( filter );
            };
        };

        return {
            options: tableOptions,
            globalFilterFactory: globalFilterFactory
        };
    }
})();
