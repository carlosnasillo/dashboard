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


    NotesTableService.$inject = ['GridTableUtil'];

    function NotesTableService(GridTableUtil) {
        var tableOptions = {
            enableColumnMenus: false,
            enableSorting: true,
            enableFiltering: true,
            columnDefs: [
                {
                    field: 'noteId',
                    displayName: 'Note Id',
                    filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('', 'vm.notesTable.filters.noteId', 'vm.notesTable.filters.filterNotes()')
                },
                {
                    field: 'issueDate',
                    displayName: 'Issue Date',
                    cellFilter: 'date:"dd/MM/yyyy"',
                    filterCellFiltered: true,
                    type: 'date',
                    filterHeaderTemplate: GridTableUtil.dateFilterTemplateFactory('vm.notesTable.filters.issueDate')
                },
                {
                    field: 'orderDate',
                    displayName: 'Order Date',
                    cellFilter: 'date:"dd/MM/yyyy"',
                    filterCellFiltered: true,
                    type: 'date',
                    filterHeaderTemplate: GridTableUtil.dateFilterTemplateFactory('vm.notesTable.filters.orderDate')
                },
                {
                    field: 'loanAmount',
                    displayName: 'Requested',
                    filterHeaderTemplate: GridTableUtil.doubleNumberFilterTemplateFactory('vm.notesTable.filters.loanAmount'),
                    type: 'number'
                },
                {
                    field: 'noteAmount',
                    displayName: 'Note Amount',
                    filterHeaderTemplate: GridTableUtil.doubleNumberFilterTemplateFactory('vm.notesTable.filters.noteAmount'),
                    type: 'number'
                },
                {
                    field: 'grade',
                    filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('', 'vm.notesTable.filters.grade', 'vm.notesTable.filters.filterNotes()')
                },
                {
                    field: 'term',
                    filterHeaderTemplate: GridTableUtil.doubleNumberFilterTemplateFactory('vm.notesTable.filters.term'),
                    type: 'number'
                },
                {
                    field: 'interestRate',
                    displayName: 'Yield',
                    filterHeaderTemplate: GridTableUtil.doublePercentFilterTemplateFactory('vm.notesTable.filters.interestRate'),
                    cellTemplate: '<div class="ui-grid-cell-contents">{{ COL_FIELD }} %</div>',
                    type: 'number'
                },
                {
                    field: 'purpose',
                    filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('', 'vm.notesTable.filters.purpose', 'vm.notesTable.filters.filterNotes()')
                }
            ]
        };

        var globalFilterFactory = function(filterValue) {
            return function(noteObj) {
                var filter = filterValue;
                return String( noteObj.noteId ).startsWith( filter ) ||
                    String( noteObj.originator ).startsWith( filter ) ||
                    String( noteObj.orderDatetoFormattedDate ).startsWith( filter ) ||
                    String( noteObj.originalData ).startsWith( filter ) ||
                    String( noteObj.loanAmount ).startsWith( filter ) ||
                    String( noteObj.noteAmount ).startsWith( filter ) ||
                    String( noteObj.term ).startsWith( filter ) ||
                    String( noteObj.interestRate ).startsWith( filter ) ||
                    String( noteObj.purpose ).startsWith( filter );
            };
        };

        return {
            options: tableOptions,
            globalFilterFactory: globalFilterFactory
        };
    }
})();