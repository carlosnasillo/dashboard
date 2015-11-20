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


    LoansTableService.$inject = ['uiGridConstants', 'GridTableUtil'];

    function LoansTableService(uiGridConstants, GridTableUtil) {
        var tableOptions = {
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
                    headerCellClass: GridTableUtil.highlightFilteredHeader
                },
                {
                    field: 'listD',
                    displayName: 'Listed',
                    headerCellClass: GridTableUtil.highlightFilteredHeader,
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
                    headerCellClass: GridTableUtil.highlightFilteredHeader,
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
                    headerCellClass: GridTableUtil.highlightFilteredHeader,
                    type: 'number',
                    cellTemplate: "<pie-chart data='row.entity.foundedPie' options='row.grid.appScope.vm.loansTable.pieChartOptions'></pie-chart>"
                },
                {
                    field: 'grade',
                    headerCellClass: GridTableUtil.highlightFilteredHeader,
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
                    headerCellClass: GridTableUtil.highlightFilteredHeader,
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
                    headerCellClass: GridTableUtil.highlightFilteredHeader,
                    cellTemplate: '<div class="ui-grid-cell-contents">{{ COL_FIELD }} %</div>',
                    type: 'number'
                },
                {
                    field: 'purpose',
                    headerCellClass: GridTableUtil.highlightFilteredHeader,
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
                    cellTemplate: "<div class='text-center'><span data-ng-if='row.entity.loanAmount > row.entity.fundedAmount' class='label label-primary' data-ng-click='row.grid.appScope.vm.order(row.entity.id, row.entity.loanAmount, row.entity.fundedAmount, row.entity.originator, row.grid.appScope.vm.investorId)'>Add to Order</span><span data-ng-if='row.entity.loanAmount === row.entity.fundedAmount' class='label label-warning' disabled='disabled'>Not available</span></div>",
                    enableFiltering: false
                }
            ]
        };

        function globalFilterFactory(filterValue) {
            return function(loanObj) {
                var filter = filterValue;
                return String( loanObj.id ).startsWith( filter ) ||
                    String( loanObj.originator ).startsWith( filter ) ||
                    String( loanObj.listDToFormatedDate ).startsWith( filter ) ||
                    String( loanObj.loanAmount ).startsWith( filter ) ||
                    String( loanObj.fundedAmount ).startsWith( filter ) ||
                    String( loanObj.term ).startsWith( filter ) ||
                    String( loanObj.intRate ).startsWith( filter ) ||
                    String( loanObj.purpose ).startsWith( filter );
            };
        }


        return {
            options: tableOptions,
            globalFilterFactory: globalFilterFactory
        };
    }
})();
