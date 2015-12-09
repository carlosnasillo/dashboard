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
                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">  <i class="fa fa-filter" ns-popover ns-popover-timeout="-1" ns-popover-template=\'<div class="ns-popover-tooltip"><div class="triangle"></div><ul><li><div class="row"><input class="col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.vm.notesTable.filters.noteId.value" data-ng-change="col.grid.appScope.vm.notesTable.filters.filterNotes()" /> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.notesTable.filters.noteId.reset()" > <i class="ui-grid-icon-cancel"></i> </button></div></li></ul></div>\' ns-popover-trigger="click" ns-popover-placement="top|left" ns-popover-plain="true"  ></i> <span class="header-filtered">{{ col.grid.appScope.vm.notesTable.filters.noteId.value }}</span> </div>'
                },
                {
                    field: 'issueDate',
                    displayName: 'Issue Date',
                    cellFilter: 'date:"dd/MM/yyyy"',
                    filterCellFiltered: true,
                    type: 'date',
                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"> <div class="row"> <span class="col-md-1"><i class="fa fa-filter" ns-popover ns-popover-timeout="-1" ns-popover-template=\'<div class="ns-popover-tooltip"><div class="triangle"></div><ul><li><div class="row"><input date-range-picker placeholder="greater than ..." class="date-picker col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.vm.notesTable.filters.issueDate.start.value" max="col.grid.appScope.vm.notesTable.filters.issueDate.end.value" options="col.grid.appScope.vm.notesTable.filters.issueDate.options" /> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.notesTable.filters.issueDate.start.reset()" > <i class="ui-grid-icon-cancel"></i> </button> </div> <div class="row"> <input date-range-picker placeholder="less than ..." class="date-picker col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.vm.notesTable.filters.issueDate.end.value" min="col.grid.appScope.vm.notesTable.filters.issueDate.start.value" options="col.grid.appScope.vm.notesTable.filters.issueDate.options"/> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.notesTable.filters.issueDate.end.reset()" > <i class="ui-grid-icon-cancel"></i> </button></div></li></ul></div>\' ns-popover-trigger="click" ns-popover-placement="top|left" ns-popover-plain="true" ></i></span> <span class="header-filtered col-md-8">{{ col.grid.appScope.vm.notesTable.filters.issueDate.start.formattedValue() }}</span></div> <div class="row"><span class="header-filtered col-md-offset-2 col-md-8">{{ col.grid.appScope.vm.notesTable.filters.issueDate.end.formattedValue() }}</span></div> </div>'
                },
                {
                    field: 'orderDate',
                    displayName: 'Order Date',
                    cellFilter: 'date:"dd/MM/yyyy"',
                    filterCellFiltered: true,
                    type: 'date',
                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"> <div class="row"> <span class="col-md-1"><i class="fa fa-filter" ns-popover ns-popover-timeout="-1" ns-popover-template=\'<div class="ns-popover-tooltip"><div class="triangle"></div><ul><li><div class="row"><input date-range-picker placeholder="greater than ..." class="date-picker col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.vm.notesTable.filters.orderDate.start.value" max="col.grid.appScope.vm.notesTable.filters.orderDate.end.value" options="col.grid.appScope.vm.notesTable.filters.orderDate.options" /> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.notesTable.filters.orderDate.start.reset()" > <i class="ui-grid-icon-cancel"></i> </button> </div> <div class="row"> <input date-range-picker placeholder="less than ..." class="date-picker col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.vm.notesTable.filters.orderDate.end.value" min="col.grid.appScope.vm.notesTable.filters.orderDate.start.value" options="col.grid.appScope.vm.notesTable.filters.orderDate.options"/> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.notesTable.filters.orderDate.end.reset()" > <i class="ui-grid-icon-cancel"></i> </button></div></li></ul></div>\' ns-popover-trigger="click" ns-popover-placement="top|left" ns-popover-plain="true" ></i></span> <span class="header-filtered col-md-8">{{ col.grid.appScope.vm.notesTable.filters.orderDate.start.formattedValue() }}</span></div> <div class="row"><span class="header-filtered col-md-offset-2 col-md-8">{{ col.grid.appScope.vm.notesTable.filters.orderDate.end.formattedValue() }}</span></div> </div>'
                },
                {
                    field: 'loanAmount',
                    displayName: 'Requested',
                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"> <div class="row"> <span class="col-md-1"><i class="fa fa-filter" ns-popover ns-popover-timeout="-1" ns-popover-template=\'<div class="ns-popover-tooltip"><div class="triangle"></div><ul><li><div class="row"><input placeholder="greater than ..." class="col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.vm.notesTable.filters.loanAmount.start.value" data-ng-change="col.grid.appScope.vm.notesTable.filters.filterNotes()"/> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.notesTable.filters.loanAmount.start.reset()" > <i class="ui-grid-icon-cancel"></i> </button> </div> <div class="row"> <input placeholder="less than ..." class="col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.vm.notesTable.filters.loanAmount.end.value" data-ng-change="col.grid.appScope.vm.notesTable.filters.filterNotes()" /> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.notesTable.filters.loanAmount.end.reset()" >  <i class="ui-grid-icon-cancel"></i> </button></div></li></ul></div>\' ns-popover-trigger="click" ns-popover-placement="top|left" ns-popover-plain="true"  ></i> </span> <span class="header-filtered col-md-8">{{ col.grid.appScope.vm.notesTable.filters.loanAmount.start.formattedValue() }}</span></div> <div class="row"><span class="header-filtered col-md-offset-2 col-md-8">{{ col.grid.appScope.vm.notesTable.filters.loanAmount.end.formattedValue() }}</span></div> </div>',
                    type: 'number'
                },
                {
                    field: 'noteAmount',
                    displayName: 'Note Amount',
                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"> <div class="row"> <span class="col-md-1"><i class="fa fa-filter" ns-popover ns-popover-timeout="-1" ns-popover-template=\'<div class="ns-popover-tooltip"><div class="triangle"></div><ul><li><div class="row"><input placeholder="greater than ..." class="col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.vm.notesTable.filters.noteAmount.start.value" data-ng-change="col.grid.appScope.vm.notesTable.filters.filterNotes()"/> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.notesTable.filters.noteAmount.start.reset()" > <i class="ui-grid-icon-cancel"></i> </button> </div> <div class="row"> <input placeholder="less than ..." class="col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.vm.notesTable.filters.noteAmount.end.value" data-ng-change="col.grid.appScope.vm.notesTable.filters.filterNotes()" /> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.notesTable.filters.noteAmount.end.reset()" >  <i class="ui-grid-icon-cancel"></i> </button></div></li></ul></div>\' ns-popover-trigger="click" ns-popover-placement="top|left" ns-popover-plain="true"  ></i> </span> <span class="header-filtered col-md-8">{{ col.grid.appScope.vm.notesTable.filters.noteAmount.start.formattedValue() }}</span></div> <div class="row"><span class="header-filtered col-md-offset-2 col-md-8">{{ col.grid.appScope.vm.notesTable.filters.noteAmount.end.formattedValue() }}</span></div> </div>',
                    type: 'number'
                },
                {
                    field: 'grade',
                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"> <div class="row"> <span class="col-md-1"><i class="fa fa-filter" ns-popover ns-popover-timeout="-1" ns-popover-template=\'<div class="ns-popover-tooltip"><div class="triangle"></div><ul><li><div class="row"><input class="col-md-offset-1 col-md-8" type="text" placeholder="ex: C, D" data-ng-model="col.grid.appScope.vm.notesTable.filters.grade.value" data-ng-change="col.grid.appScope.vm.notesTable.filters.filterNotes()" /> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.notesTable.filters.grade.reset()" > <i class="ui-grid-icon-cancel"></i> </button></div></li></ul></div>\' ns-popover-trigger="click" ns-popover-placement="top|left" ns-popover-plain="true" ></i></span> <span class="header-filtered">{{ col.grid.appScope.vm.notesTable.filters.grade.value }}</span> </div>'
                },
                {
                    field: 'term',
                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"> <div class="row"> <span class="col-md-1"><i class="fa fa-filter" ns-popover ns-popover-timeout="-1" ns-popover-template=\'<div class="ns-popover-tooltip"><div class="triangle"></div><ul><li><div class="row"><input placeholder="greater than ..." class="col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.vm.notesTable.filters.term.start.value" data-ng-change="col.grid.appScope.vm.notesTable.filters.filterNotes()"/> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.notesTable.filters.term.start.reset()" > <i class="ui-grid-icon-cancel"></i> </button> </div> <div class="row"> <input placeholder="less than ..." class="col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.vm.notesTable.filters.term.end.value" data-ng-change="col.grid.appScope.vm.notesTable.filters.filterNotes()" /> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.notesTable.filters.term.end.reset()" >  <i class="ui-grid-icon-cancel"></i> </button></div></li></ul></div>\' ns-popover-trigger="click" ns-popover-placement="top|left" ns-popover-plain="true"  ></i> </span> <span class="header-filtered col-md-8">{{ col.grid.appScope.vm.notesTable.filters.term.start.formattedValue() }}</span></div> <div class="row"><span class="header-filtered col-md-offset-2 col-md-8">{{ col.grid.appScope.vm.notesTable.filters.term.end.formattedValue() }}</span></div> </div>',
                    type: 'number'
                },
                {
                    field: 'interestRate',
                    displayName: 'Yield',
                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"> <div class="row"> <span class="col-md-1"><i class="fa fa-filter" ns-popover ns-popover-timeout="-1" ns-popover-template=\'<div class="ns-popover-tooltip"><div class="triangle"></div><ul><li><div class="row"><input placeholder="greater than (%)" class="col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.vm.notesTable.filters.interestRate.start.value" data-ng-change="col.grid.appScope.vm.notesTable.filters.filterNotes()"/> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.notesTable.filters.interestRate.start.reset()" > <i class="ui-grid-icon-cancel"></i> </button> </div> <div class="row"> <input placeholder="less than (%)" class="col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.vm.notesTable.filters.interestRate.end.value" data-ng-change="col.grid.appScope.vm.notesTable.filters.filterNotes()" /> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.notesTable.filters.interestRate.end.reset()" >  <i class="ui-grid-icon-cancel"></i> </button></div></li></ul></div>\' ns-popover-trigger="click" ns-popover-placement="top|left" ns-popover-plain="true"  ></i> </span> <span class="header-filtered col-md-8">{{ col.grid.appScope.vm.notesTable.filters.interestRate.start.formattedValue() }}</span></div> <div class="row"><span class="header-filtered col-md-offset-2 col-md-8">{{ col.grid.appScope.vm.notesTable.filters.interestRate.end.formattedValue() }}</span></div> </div>',
                    cellTemplate: '<div class="ui-grid-cell-contents">{{ COL_FIELD }} %</div>',
                    type: 'number'
                },
                {
                    field: 'purpose',
                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"> <div class="row"> <span class="col-md-1"><i class="fa fa-filter" ns-popover ns-popover-timeout="-1" ns-popover-template=\'<div class="ns-popover-tooltip"><div class="triangle"></div><ul><li><div class="row"><input class="col-md-offset-1 col-md-8" type="text" placeholder="ex: house, car" data-ng-model="col.grid.appScope.vm.notesTable.filters.purpose.value" data-ng-change="col.grid.appScope.vm.notesTable.filters.filterNotes()" /> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.notesTable.filters.purpose.reset()" > <i class="ui-grid-icon-cancel"></i> </button></div></li></ul></div>\' ns-popover-trigger="click" ns-popover-placement="top|left" ns-popover-plain="true" ></i></span> <span class="header-filtered">{{ col.grid.appScope.vm.notesTable.filters.purpose.value }}</span> </div>'
                }
            ]
        };

        var noteIdFilterFactory = function(postResetCallback) {
            var initialValue = "";

            var noteIdFilter = {};
            noteIdFilter.value = initialValue;
            noteIdFilter.reset = GridTableUtil.resetFactory(noteIdFilter, initialValue, postResetCallback);
            noteIdFilter.filterFn = GridTableUtil.filterFnFactory(noteIdFilter, function(objToFilter, filterTerm) { return String( objToFilter.noteId ).startsWith( filterTerm ); });

            return noteIdFilter;
        };

        var loanAmountFilterFactory = function(postResetCallback) {
            var initialValue = "";

            var start = {};
            start.value = initialValue;
            start.reset = GridTableUtil.resetFactory(start, initialValue, postResetCallback);

            var end = {};
            end.value = initialValue;
            end.reset = GridTableUtil.resetFactory(end, initialValue, postResetCallback);

            start.formattedValue = GridTableUtil.formattedValueFactory(start, end);
            end.formattedValue = GridTableUtil.formattedValueFactory(end, start);

            start.filterFn = GridTableUtil.filterFnFactory(start, function(objToFilter, filterTerm) { return objToFilter.loanAmount > filterTerm; });
            end.filterFn = GridTableUtil.filterFnFactory(end, function(objToFilter, filterTerm) { return objToFilter.loanAmount < filterTerm; });

            return { start: start, end: end };
        };

        var noteAmountFilterFactory = function(postResetCallback) {
            var initialValue = "";

            var start = {};
            start.value = initialValue;
            start.reset = GridTableUtil.resetFactory(start, initialValue, postResetCallback);

            var end = {};
            end.value = initialValue;
            end.reset = GridTableUtil.resetFactory(end, initialValue, postResetCallback);

            start.formattedValue = GridTableUtil.formattedValueFactory(start, end);
            end.formattedValue = GridTableUtil.formattedValueFactory(end, start);

            start.filterFn = GridTableUtil.filterFnFactory(start, function(objToFilter, filterTerm) { return objToFilter.noteAmount > filterTerm; });
            end.filterFn = GridTableUtil.filterFnFactory(end, function(objToFilter, filterTerm) { return objToFilter.noteAmount < filterTerm; });

            return { start: start, end: end };
        };

        var gradeFilterFactory = function(postResetCallback) {
            var initialValue = "";

            var gradeFilter = {};
            gradeFilter.value = initialValue;
            gradeFilter.reset = GridTableUtil.resetFactory(gradeFilter, initialValue, postResetCallback);
            gradeFilter.filterFn = GridTableUtil.filterFnFactory(gradeFilter, function(objToFilter, filterTerm) { return filterTerm.split(',').map(function(search) { return search.trim(); }).indexOf(objToFilter.grade) >= 0; });

            return gradeFilter;
        };

        var termFilterFactory = function(postResetCallback) {
            var initialValue = "";

            var start = {};
            start.value = initialValue;
            start.reset = GridTableUtil.resetFactory(start, initialValue, postResetCallback);

            var end = {};
            end.value = initialValue;
            end.reset = GridTableUtil.resetFactory(end, initialValue, postResetCallback);

            start.formattedValue = GridTableUtil.formattedValueFactory(start, end);
            end.formattedValue = GridTableUtil.formattedValueFactory(end, start);

            start.filterFn = GridTableUtil.filterFnFactory(start, function(objToFilter, filterTerm) { return objToFilter.term > filterTerm; });
            end.filterFn = GridTableUtil.filterFnFactory(end, function(objToFilter, filterTerm) { return objToFilter.term < filterTerm; });

            return { start: start, end: end };
        };

        var interestRateFilterFactory = function(postResetCallback) {
            var initialValue = "";

            var start = {};
            start.value = initialValue;
            start.reset = GridTableUtil.resetFactory(start, initialValue, postResetCallback);

            var end = {};
            end.value = initialValue;
            end.reset = GridTableUtil.resetFactory(end, initialValue, postResetCallback);

            var formatter = function(value) { return value + ' %'; };
            start.formattedValue = GridTableUtil.formattedValueFactory(start, end, formatter);
            end.formattedValue = GridTableUtil.formattedValueFactory(end, start, formatter);

            start.filterFn = GridTableUtil.filterFnFactory(start, function(objToFilter, filterTerm) { return objToFilter.interestRate > filterTerm; });
            end.filterFn = GridTableUtil.filterFnFactory(end, function(objToFilter, filterTerm) { return objToFilter.interestRate < filterTerm; });

            return { start: start, end: end };
        };

        var purposeFilterFactory = function(postResetCallback) {
            var initialValue = "";

            var purposeFilter = {};
            purposeFilter.value = initialValue;
            purposeFilter.reset = GridTableUtil.resetFactory(purposeFilter, initialValue, postResetCallback);
            purposeFilter.filterFn = GridTableUtil.filterFnFactory(purposeFilter, function(objToFilter, filterTerm) {
                var searchTerms = filterTerm.split(',').map(function(search) { return search.trim(); });
                for (var i in searchTerms) {
                    if ( searchTerms.hasOwnProperty(i) && searchTerms[i].length > 0) {
                        if (objToFilter.purpose.startsWith(searchTerms[i])) return true;
                    }
                }
                return false;
            });

            return purposeFilter;
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
            noteIdFilterFactory: noteIdFilterFactory,
            loanAmountFilterFactory: loanAmountFilterFactory,
            noteAmountFilterFactory: noteAmountFilterFactory,
            gradeFilterFactory: gradeFilterFactory,
            termFilterFactory: termFilterFactory,
            interestRateFilterFactory: interestRateFilterFactory,
            purposeFilterFactory: purposeFilterFactory,
            globalFilterFactory: globalFilterFactory
        };
    }
})();