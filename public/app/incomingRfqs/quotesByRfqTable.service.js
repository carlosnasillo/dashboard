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
* Created on 21/12/2015
*/

(function(){
    'use strict';

    angular
        .module('app')
        .factory('QuotesByRfqTableService', QuotesByRfqTableService);

    QuotesByRfqTableService.$inject = ['uiGridConstants', 'GridTableUtil'];

    function QuotesByRfqTableService(uiGridConstants, GridTableUtil) {
        var tableOptions = function() {
            return {
                enableColumnMenus: false,
                enableSorting: true,
                enableFiltering: true,
                columnDefs: [
                    {
                        field: 'id',
                        headerCellClass: 'text-center',
                        filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('', 'vm.quotesTable.filters.id', 'vm.quotesTable.filters.filterQuotes()')
                    },
                    {
                        field: 'referenceEntities',
                        headerCellClass: 'text-center',
                        cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope"><a href="/#/loanbook/{{row.entity.referenceEntities | listAsUrlParams}}">{{row.entity.referenceEntities | prettifyList}}</a></div>',
                        filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('', 'vm.quotesTable.filters.referenceEntities', 'vm.quotesTable.filters.filterQuotes()')
                    },
                    {
                        field: 'client.account',
                        displayName: 'Client',
                        headerCellClass: 'text-center',
                        filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('ex: Dealer1, ...', 'vm.quotesTable.filters.client', 'vm.quotesTable.filters.filterQuotes()')
                    },
                    {
                        field: 'timestamp',
                        sort: { direction: uiGridConstants.DESC, priority: 0 },
                        headerCellClass: 'text-center',
                        cellFilter: 'date:"HH:mm:ss"',
                        filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('ex: 14:30:10', 'vm.quotesTable.filters.timestampStr', 'vm.quotesTable.filters.filterQuotes()')
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
                        displayName: 'Cancel',
                        headerCellClass: 'text-center',
                        cellTemplate: "<div class='ui-grid-cell-contents ng-binding ng-scope'><div class='text-center'><button class='btn btn-primary btn-xs' data-ng-disabled='row.grid.appScope.vm.isExpired(row.entity.timeout)' data-ng-click='row.grid.appScope.vm.cancelQuote(row.entity)'>Cancel</button></div></div>",
                        enableFiltering: false,
                        filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('', 'vm.quotesTable.filters.id', 'vm.quotesTable.filters.filterQuotes()')
                    }
                ]
            };
        };

        return {
            options: tableOptions
        };
    }
})();