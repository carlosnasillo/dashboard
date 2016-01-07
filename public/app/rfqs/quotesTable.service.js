/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 *
 */

/**
* @author : julienderay
* Created on 13/12/2015
*/

(function() {
    'use strict';

    angular
        .module('app')
        .factory('QuotesTableService', QuotesTableService);

    QuotesTableService.$inject = ['uiGridConstants', 'GridTableUtil'];

    function QuotesTableService(uiGridConstants, GridTableUtil) {

        var tableOptions = function() {
            return {
                enableColumnMenus: false,
                enableSorting: true,
                enableFiltering: true,
                columnDefs: [
                    {
                        field: 'timestamp',
                        sort: { direction: uiGridConstants.DESC, priority: 0 },
                        headerCellClass: 'text-center',
                        cellFilter: 'date:"HH:mm:ss"',
                        filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('', 'vm.quotesTable.filters.timestampStr', 'vm.quotesTable.filters.filterQuotes()')
                    },
                    {
                        field: 'referenceEntities',
                        headerCellClass: 'text-center',
                        cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope"><a href="/#/loanbook/{{row.entity.referenceEntities | listAsUrlParams}}">{{row.entity.referenceEntities | prettifyList}}</a></div>',
                        filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('', 'vm.quotesTable.filters.referenceEntities', 'vm.quotesTable.filters.filterQuotes()')
                    },
                    {
                        field: 'id',
                        headerCellClass: 'text-center',
                        filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('', 'vm.quotesTable.filters.id', 'vm.quotesTable.filters.filterQuotes()')
                    },
                    {
                        field: 'dealer.account',
                        displayName: 'Counterparty',
                        headerCellClass: 'text-center',
                        filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('', 'vm.quotesTable.filters.dealer', 'vm.quotesTable.filters.filterQuotes()')
                    },
                    {
                        field: 'premium',
                        headerCellClass: 'text-center',
                        filterHeaderTemplate: GridTableUtil.doubleNumberFilterTemplateFactory('vm.quotesTable.filters.premium', 'vm.quotesTable.filters.filterQuotes()')
                    },
                    {
                        field: 'state',
                        headerCellClass: 'text-center',
                        filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('Outstanding, ...', 'vm.quotesTable.filters.state', 'vm.quotesTable.filters.filterQuotes()')
                    },
                    {
                        field: 'timeout',
                        displayName: 'Timeout in seconds',
                        type: 'text',
                        headerCellClass: 'text-center',
                        filterHeaderTemplate: GridTableUtil.doubleNumberFilterTemplateFactory('vm.quotesTable.filters.timeout', 'vm.quotesTable.filters.filterQuotes()')
                    },
                    {
                        field: 'id',
                        displayName: 'Accept',
                        headerCellClass: 'text-center',
                        cellTemplate: "<div class='ui-grid-cell-contents ng-binding ng-scope'><div class='text-center'><button data-ng-hide='row.entity.loading' class='btn btn-primary btn-xs' data-ng-disabled='row.grid.appScope.vm.disableButton(row.entity)' data-ng-click='row.grid.appScope.vm.accept(row.entity)'>Accept</button><div data-ng-show='row.entity.loading' class='sk-spinner sk-spinner-wave'> <div class='sk-rect1'></div> <div class='sk-rect2'></div> <div class='sk-rect3'></div> <div class='sk-rect4'></div> <div class='sk-rect5'></div> </div></div></div>",
                        enableFiltering: false
                    }
                ]
            };
        };

        return {
            options: tableOptions
        };
    }

})();