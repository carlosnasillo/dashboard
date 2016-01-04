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
                        field: 'referenceEntity',
                        headerCellClass: 'text-center',
                        cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope"><a href="/#/loanbook/{{row.entity.referenceEntity}}">{{row.entity.referenceEntity}}</a></div>',
                        filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('', 'vm.quotesTable.filters.referenceEntity', 'vm.quotesTable.filters.filterQuotes()')
                    },
                    {
                        field: 'client',
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
                        field: 'timeout',
                        displayName: 'Timeout in seconds',
                        type: 'text',
                        headerCellClass: 'text-center',
                        filterHeaderTemplate: GridTableUtil.doubleNumberFilterTemplateFactory('vm.quotesTable.filters.timeout', 'vm.quotesTable.filters.filterQuotes()')
                    }
                ]
            };
        };

        return {
            options: tableOptions
        };
    }
})();