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

        function globalFilterFactory(filterValue) {
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
        }

        return {
            options: tableOptions,
            globalFilterFactory: globalFilterFactory
        };
    }
})();