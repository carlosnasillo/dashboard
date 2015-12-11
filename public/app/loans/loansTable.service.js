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
                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"> <i class="fa fa-filter" ns-popover ns-popover-timeout="-1" ns-popover-template=\'<div class="ns-popover-tooltip"><div class="triangle"></div><ul><li><div class="row"><input class="col-md-offset-1 col-md-8" type="text" placeholder="ex: Lending Club, ..." data-ng-model="col.grid.appScope.vm.loansTable.filters.originator.value" data-ng-change="col.grid.appScope.vm.loansTable.filters.filterLoans()" /> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.loansTable.filters.originator.reset()" > <i class="ui-grid-icon-cancel"></i> </button></div></li></ul></div>\' ns-popover-trigger="click" ns-popover-placement="top|left" ns-popover-plain="true"></i> <span class="header-filtered">{{ col.grid.appScope.vm.loansTable.filters.originator.value }}</span> </div>'
                },
                {
                    field: 'id',
                    displayName: 'Listing Id',
                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">  <i class="fa fa-filter" ns-popover ns-popover-timeout="-1" ns-popover-template=\'<div class="ns-popover-tooltip"><div class="triangle"></div><ul><li><div class="row"><input class="col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.vm.loansTable.filters.identifier.value" data-ng-change="col.grid.appScope.vm.loansTable.filters.filterLoans()" /> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.loansTable.filters.identifier.reset()" > <i class="ui-grid-icon-cancel"></i> </button></div></li></ul></div>\' ns-popover-trigger="click" ns-popover-placement="top|left" ns-popover-plain="true"  ></i> <span class="header-filtered">{{ col.grid.appScope.vm.loansTable.filters.identifier.value }}</span> </div>'
                },
                {
                    field: 'listD',
                    displayName: 'Listed',
                    cellFilter: 'date:"dd/MM/yyyy"',
                    filterCellFiltered: true,
                    type: 'date',
                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"> <div class="row"> <span class="col-md-1"><i class="fa fa-filter" ns-popover ns-popover-timeout="-1" ns-popover-template=\'<div class="ns-popover-tooltip"><div class="triangle"></div><ul><li><div class="row"><input date-range-picker placeholder="greater than ..." class="date-picker col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.vm.loansTable.filters.listD.start.value" max="col.grid.appScope.vm.loansTable.filters.listD.end.value" options="col.grid.appScope.vm.loansTable.filters.listD.options" /> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.loansTable.filters.listD.start.reset()" > <i class="ui-grid-icon-cancel"></i> </button> </div> <div class="row"> <input date-range-picker placeholder="less than ..." class="date-picker col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.vm.loansTable.filters.listD.end.value" min="col.grid.appScope.vm.loansTable.filters.listD.start.value" options="col.grid.appScope.vm.loansTable.filters.listD.options"/> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.loansTable.filters.listD.end.reset()" > <i class="ui-grid-icon-cancel"></i> </button></div></li></ul></div>\' ns-popover-trigger="click" ns-popover-placement="top|left" ns-popover-plain="true" ></i></span> <span class="header-filtered col-md-8">{{ col.grid.appScope.vm.loansTable.filters.listD.start.formattedValue() }}</span></div> <div class="row"><span class="header-filtered col-md-offset-2 col-md-8">{{ col.grid.appScope.vm.loansTable.filters.listD.end.formattedValue() }}</span></div> </div>'
                },
                {
                    field: 'loanAmount',
                    displayName: 'Requested',
                    type: 'number',
                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"> <div class="row"> <span class="col-md-1"><i class="fa fa-filter" ns-popover ns-popover-timeout="-1" ns-popover-template=\'<div class="ns-popover-tooltip"><div class="triangle"></div><ul><li><div class="row"><input placeholder="greater than ..." class="col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.vm.loansTable.filters.loanAmount.start.value" data-ng-change="col.grid.appScope.vm.loansTable.filters.filterLoans()"/> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.loansTable.filters.loanAmount.start.reset()" > <i class="ui-grid-icon-cancel"></i> </button> </div> <div class="row"> <input placeholder="less than ..." class="col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.vm.loansTable.filters.loanAmount.end.value" data-ng-change="col.grid.appScope.vm.loansTable.filters.filterLoans()" /> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.loansTable.filters.loanAmount.end.reset()" >  <i class="ui-grid-icon-cancel"></i> </button></div></li></ul></div>\' ns-popover-trigger="click" ns-popover-placement="top|left" ns-popover-plain="true"  ></i> </span> <span class="header-filtered col-md-8">{{ col.grid.appScope.vm.loansTable.filters.loanAmount.start.formattedValue() }}</span></div> <div class="row"><span class="header-filtered col-md-offset-2 col-md-8">{{ col.grid.appScope.vm.loansTable.filters.loanAmount.end.formattedValue() }}</span></div> </div>'
                },
                {
                    field: 'fundedAmountPerCenter',
                    displayName: 'Funded',
                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"> <div class="row"> <span class="col-md-1"><i class="fa fa-filter" ns-popover ns-popover-timeout="-1" ns-popover-template=\'<div class="ns-popover-tooltip"><div class="triangle"></div><ul><li><div class="row"><input placeholder="greater than (%)" class="col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.vm.loansTable.filters.fundedAmountPerCent.start.value" data-ng-change="col.grid.appScope.vm.loansTable.filters.filterLoans()"/> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.loansTable.filters.fundedAmountPerCent.start.reset()" > <i class="ui-grid-icon-cancel"></i> </button> </div> <div class="row"> <input placeholder="less than (%)" class="col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.vm.loansTable.filters.fundedAmountPerCent.end.value" data-ng-change="col.grid.appScope.vm.loansTable.filters.filterLoans()" /> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.loansTable.filters.fundedAmountPerCent.end.reset()" >  <i class="ui-grid-icon-cancel"></i> </button></div></li></ul></div>\' ns-popover-trigger="click" ns-popover-placement="top|left" ns-popover-plain="true"  ></i> </span> <span class="header-filtered col-md-8">{{ col.grid.appScope.vm.loansTable.filters.fundedAmountPerCent.start.formattedValue() }}</span></div> <div class="row"><span class="header-filtered col-md-offset-2 col-md-8">{{ col.grid.appScope.vm.loansTable.filters.fundedAmountPerCent.end.formattedValue() }}</span></div> </div>',
                    type: 'number',
                    cellTemplate: "<pie-chart data='row.entity.foundedPie' options='row.grid.appScope.vm.loansTable.pieChartOptions'></pie-chart>"
                },
                {
                    field: 'grade',
                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"> <div class="row"> <span class="col-md-1"><i class="fa fa-filter" ns-popover ns-popover-timeout="-1" ns-popover-template=\'<div class="ns-popover-tooltip"><div class="triangle"></div><ul><li><div class="row"><input class="col-md-offset-1 col-md-8" type="text" placeholder="ex: C, D" data-ng-model="col.grid.appScope.vm.loansTable.filters.grade.value" data-ng-change="col.grid.appScope.vm.loansTable.filters.filterLoans()" /> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.loansTable.filters.grade.reset()" > <i class="ui-grid-icon-cancel"></i> </button></div></li></ul></div>\' ns-popover-trigger="click" ns-popover-placement="top|left" ns-popover-plain="true" ></i></span> <span class="header-filtered">{{ col.grid.appScope.vm.loansTable.filters.grade.value }}</span> </div>'
                },
                {
                    field: 'term',
                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"> <div class="row"> <span class="col-md-1"><i class="fa fa-filter" ns-popover ns-popover-timeout="-1" ns-popover-template=\'<div class="ns-popover-tooltip"><div class="triangle"></div><ul><li><div class="row"><input placeholder="greater than" class="col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.vm.loansTable.filters.term.start.value" data-ng-change="col.grid.appScope.vm.loansTable.filters.filterLoans()"/> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.loansTable.filters.term.start.reset()" > <i class="ui-grid-icon-cancel"></i> </button> </div> <div class="row"> <input placeholder="less than" class="col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.vm.loansTable.filters.term.end.value" data-ng-change="col.grid.appScope.vm.loansTable.filters.filterLoans()" /> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.loansTable.filters.term.end.reset()" >  <i class="ui-grid-icon-cancel"></i> </button></div></li></ul></div>\' ns-popover-trigger="click" ns-popover-placement="top|left" ns-popover-plain="true"  ></i></span> <span class="header-filtered col-md-8">{{ col.grid.appScope.vm.loansTable.filters.term.start.formattedValue() }}</span></div> <div class="row"><span class="header-filtered col-md-offset-2 col-md-8">{{ col.grid.appScope.vm.loansTable.filters.term.end.formattedValue() }}</span></div> </div>',
                    type: 'number'
                },
                {
                    field: 'intRate',
                    displayName: 'Yield',
                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"> <div class="row"> <span class="col-md-1"><i class="fa fa-filter" ns-popover ns-popover-timeout="-1" ns-popover-template=\'<div class="ns-popover-tooltip"><div class="triangle"></div><ul><li><div class="row"><input placeholder="greater than (%)" class="col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.vm.loansTable.filters.intRate.start.value" data-ng-change="col.grid.appScope.vm.loansTable.filters.filterLoans()"/> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.loansTable.filters.intRate.start.reset()" > <i class="ui-grid-icon-cancel"></i> </button> </div> <div class="row"> <input placeholder="less than (%)" class="col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.vm.loansTable.filters.intRate.end.value" data-ng-change="col.grid.appScope.vm.loansTable.filters.filterLoans()" /> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.loansTable.filters.intRate.end.reset()" >  <i class="ui-grid-icon-cancel"></i> </button></div></li></ul></div>\' ns-popover-trigger="click" ns-popover-placement="top|left" ns-popover-plain="true"  ></i> </span> <span class="header-filtered col-md-8">{{ col.grid.appScope.vm.loansTable.filters.intRate.start.formattedValue() }}</span></div> <div class="row"><span class="header-filtered col-md-offset-2 col-md-8">{{ col.grid.appScope.vm.loansTable.filters.intRate.end.formattedValue() }}</span></div> </div>',
                    cellTemplate: '<div class="ui-grid-cell-contents">{{ COL_FIELD }} %</div>',
                    type: 'number'
                },
                {
                    field: 'purpose',
                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"> <div class="row"> <span class="col-md-1"><i class="fa fa-filter" ns-popover ns-popover-timeout="-1" ns-popover-template=\'<div class="ns-popover-tooltip"><div class="triangle"></div><ul><li><div class="row"><input class="col-md-offset-1 col-md-8" type="text" placeholder="ex: house, car" data-ng-model="col.grid.appScope.vm.loansTable.filters.purpose.value" data-ng-change="col.grid.appScope.vm.loansTable.filters.filterLoans()" /> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.vm.loansTable.filters.purpose.reset()" > <i class="ui-grid-icon-cancel"></i> </button></div></li></ul></div>\' ns-popover-trigger="click" ns-popover-placement="top|left" ns-popover-plain="true"  ></i> </span> <span class="header-filtered">{{ col.grid.appScope.vm.loansTable.filters.purpose.value }}</span></div>'
                },
                {
                    field: 'id',
                    displayName: 'Order',
                    cellTemplate: "<div class='text-center'><span data-ng-if='row.entity.loanAmount > row.entity.fundedAmount' class='label label-primary' data-ng-click='row.grid.appScope.vm.order(row.entity.id, row.entity.loanAmount, row.entity.fundedAmount, row.entity.originator, row.grid.appScope.vm.investorId)'>Add to Order</span><span data-ng-if='row.entity.loanAmount === row.entity.fundedAmount' class='label label-warning' disabled='disabled'>Not available</span></div>",
                    enableFiltering: false
                }
            ]
        };

        var identifierFilterFactory = function(postResetCallback) {
            return GridTableUtil.singleFilterFactory(
                postResetCallback,
                function(objToFilter, filterTerm) { return String( objToFilter.id ).startsWith( filterTerm ); }
            );
        };

        var originatorFilterFactory = function(postResetCallback) {
            return GridTableUtil.singleFilterFactory(
                postResetCallback,
                function(objToFilter, filterTerm) {
                    var searchTerms = filterTerm.split(',').map(function (search) {
                        return search.trim();
                    });
                    for (var i in searchTerms) {
                        if (searchTerms.hasOwnProperty(i) && searchTerms[i].length > 0) {
                            if (objToFilter.originator.startsWith(searchTerms[i])) return true;
                        }
                    }
                    return false;
                }
            );
        };

        var loanAmountFilterFactory = function(postResetCallback) {
            return GridTableUtil.doubleFilterFactory(
                postResetCallback,
                function(objToFilter, filterTerm) { return objToFilter.loanAmount > filterTerm; },
                function(objToFilter, filterTerm) { return objToFilter.loanAmount < filterTerm; }
            );
        };

        var fundedAmountPerCentFilterFactory = function(postResetCallback) {
            return GridTableUtil.doubleFilterFactory(
                postResetCallback,
                function(objToFilter, filterTerm) { return objToFilter.fundedAmountPerCent > filterTerm; },
                function(objToFilter, filterTerm) { return objToFilter.fundedAmountPerCent < filterTerm; },
                function(value) { return value + " %"; }
            );
        };

        var gradeFilterFactory = function(postResetCallback) {
            return GridTableUtil.singleFilterFactory(
                postResetCallback,
                function(objToFilter, filterTerm) { return filterTerm.split(',').map(function(search) { return search.trim(); }).indexOf(objToFilter.grade) >= 0; }
            );
        };

        var termFilterFactory = function(postResetCallback) {
            return GridTableUtil.doubleFilterFactory(
                postResetCallback,
                function(objToFilter, filterTerm) { return objToFilter.term > filterTerm; },
                function(objToFilter, filterTerm) { return objToFilter.term < filterTerm; }
            );
        };

        var intRateFilterFactory = function(postResetCallback) {
            return GridTableUtil.doubleFilterFactory(
                postResetCallback,
                function(objToFilter, filterTerm) { return objToFilter.intRate > filterTerm; },
                function(objToFilter, filterTerm) { return objToFilter.intRate < filterTerm; },
                function(value) { return value + " %"; }
            );
        };

        var purposeFilterFactory = function(postResetCallback) {
            return GridTableUtil.singleFilterFactory(
                postResetCallback,
                function(objToFilter, filterTerm) {
                    var searchTerms = filterTerm.split(',').map(function(search) { return search.trim(); });
                    for (var i in searchTerms) {
                        if ( searchTerms.hasOwnProperty(i) && searchTerms[i].length > 0) {
                            if (objToFilter.purpose.startsWith(searchTerms[i])) return true;
                        }
                    }
                    return false;
                }
            );
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
            identifierFilterFactory: identifierFilterFactory,
            originatorFilterFactory: originatorFilterFactory,
            loanAmountFilterFactory: loanAmountFilterFactory,
            fundedAmountPerCentFilterFactory: fundedAmountPerCentFilterFactory,
            gradeFilterFactory: gradeFilterFactory,
            termFilterFactory: termFilterFactory,
            intRateFilterFactory: intRateFilterFactory,
            purposeFilterFactory: purposeFilterFactory,
            globalFilterFactory: globalFilterFactory
        };
    }
})();
