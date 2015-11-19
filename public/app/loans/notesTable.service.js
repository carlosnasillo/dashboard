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
        .factory('NotesTableService', NotesTableService);


    NotesTableService.$inject = ['uiGridConstants', 'GridTableUtil'];

    function NotesTableService(uiGridConstants, GridTableUtil) {
        var tableOptions = {
            enableColumnMenus: false,
            enableSorting: true,
            enableFiltering: true,
            columnDefs: [
                {
                    field: 'noteId',
                    displayName: 'Note Id',
                    headerCellClass: GridTableUtil.highlightFilteredHeader
                },
                {
                    field: 'issueDate',
                    displayName: 'Issue Date',
                    headerCellClass: GridTableUtil.highlightFilteredHeader,
                    cellFilter: 'date:"dd/MM/yyyy"',
                    filterCellFiltered: true,
                    type: 'date',
                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div class="row"> <input date-range-picker placeholder="greater than ..." class="date-picker col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.vm.notesTable.datePicker.issueDate.startDate" max="col.grid.appScope.vm.notesTable.datePicker.issueDate.endDate" options="col.grid.appScope.vm.loansTable.datePicker.options" /><button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.notesTable.datePicker.resetIssueDate.start()"><i class="ui-grid-icon-cancel"></i></button></div> <div class="row"> <input date-range-picker placeholder="less than ..." class="date-picker col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.vm.notesTable.datePicker.issueDate.endDate" min="col.grid.appScope.vm.notesTable.datePicker.issueDate.startDate" options="col.grid.appScope.vm.notesTable.datePicker.options" /><button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.notesTable.datePicker.resetIssueDate.end()"><i class="ui-grid-icon-cancel"></i></button></div></div>'
                },
                {
                    field: 'orderDate',
                    displayName: 'Order Date',
                    headerCellClass: GridTableUtil.highlightFilteredHeader,
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
                    headerCellClass: GridTableUtil.highlightFilteredHeader,
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
                    headerCellClass: GridTableUtil.highlightFilteredHeader,
                    type: 'number'
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
                }
            ]
        };

        function globalFilterFactory(filterValue) {
            return function(noteObj) {
                var filter = filterValue;
                return String( noteObj.noteId ).startsWith( filter ) ||
                    String( noteObj.originator ).startsWith( filter ) ||
                    String( noteObj.orderDateToFormatedDate ).startsWith( filter ) ||
                    String( noteObj.originalData ).startsWith( filter ) ||
                    String( noteObj.loanAmount ).startsWith( filter ) ||
                    String( noteObj.noteAmount ).startsWith( filter ) ||
                    String( noteObj.term ).startsWith( filter ) ||
                    String( noteObj.interestRate ).startsWith( filter ) ||
                    String( noteObj.purpose ).startsWith( filter );
            };
        }

        return {
            options: tableOptions,
            globalFilterFactory: globalFilterFactory
        };
    }
})();