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
* Created on 14/12/2015
*/

(function() {
    'use strict';

    angular
        .module('app')
        .factory('TradesTableService', TradesTableService);

    TradesTableService.$inject = ['uiGridConstants', 'GridTableUtil'];

    function TradesTableService(uiGridConstants, GridTableUtil) {

        var tableOptions = function() {
            return {
                enableColumnMenus: false,
                enableSorting: true,
                enableFiltering: true,
                columnDefs: [
                    {
                        field: 'id',
                        headerCellClass: 'text-center',
                        visible: false,
                        filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('', 'vm.tradesTable.filters.id', 'vm.tradesTable.filters.filterTrades()')
                    },
                    {
                        field: 'referenceEntity',
                        headerCellClass: 'text-center',
                        cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope"><a href="/#/loanbook/{{row.entity.referenceEntities | listAsUrlParams}}">{{row.entity.referenceEntities | prettifyList}}</a></div>',
                        filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('', 'vm.tradesTable.filters.referenceEntities', 'vm.tradesTable.filters.filterTrades()')
                    },
                    {
                        field: 'side',
                        headerCellClass: 'text-center',
                        filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('', 'vm.tradesTable.filters.side', 'vm.tradesTable.filters.filterTrades()')
                    },
                    {
                        field: 'client',
                        headerCellClass: 'text-center',
                        filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('', 'vm.tradesTable.filters.client', 'vm.tradesTable.filters.filterTrades()')
                    },
                    {
                        field: 'dealer',
                        headerCellClass: 'text-center',
                        displayName: 'Counterparty',
                        filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('', 'vm.tradesTable.filters.dealer', 'vm.tradesTable.filters.filterTrades()')
                    },
                    {
                        field: 'rfqId',
                        headerCellClass: 'text-center',
                        filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('', 'vm.tradesTable.filters.rfqId', 'vm.tradesTable.filters.filterTrades()')
                    },
                    {
                        field: 'quoteId',
                        headerCellClass: 'text-center',
                        filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('', 'vm.tradesTable.filters.quoteId', 'vm.tradesTable.filters.filterTrades()')
                    },
                    {
                        field: 'timestamp',
                        displayName: 'Created on',
                        cellFilter: 'date:"dd/MM/yyyy"',
                        sort: { direction: uiGridConstants.DESC, priority: 0 },
                        headerCellClass: 'text-center',
                        filterHeaderTemplate: GridTableUtil.dateFilterTemplateFactory('vm.tradesTable.filters.timestamp')
                    },
                    {
                        field: 'durationInMonths',
                        headerCellClass: 'text-center',
                        filterHeaderTemplate: GridTableUtil.doubleNumberFilterTemplateFactory('vm.tradesTable.filters.durationInMonths', 'vm.tradesTable.filters.filterTrades()')
                    },
                    {
                        field: 'creditEvents',
                        headerCellClass: 'text-center',
                        cellFilter: 'prettifyList',
                        filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('', 'vm.tradesTable.filters.creditEvents', 'vm.tradesTable.filters.filterTrades()')
                    },
                    {
                        field: 'cdsValue',
                        headerCellClass: 'text-center',
                        filterHeaderTemplate: GridTableUtil.doubleNumberFilterTemplateFactory('vm.tradesTable.filters.cdsValue', 'vm.tradesTable.filters.filterTrades()')
                    },
                    {
                        field: 'premium',
                        headerCellClass: 'text-center',
                        filterHeaderTemplate: GridTableUtil.doubleNumberFilterTemplateFactory('vm.tradesTable.filters.premium', 'vm.tradesTable.filters.filterTrades()')
                    }
                ]
            };
        };

        return {
            options: tableOptions
        };
    }

})();