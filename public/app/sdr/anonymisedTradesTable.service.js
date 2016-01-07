/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 */

/**
* @author : julienderay
* Created on 14/12/2015
*/

(function() {
    'use strict';

    angular
        .module('app')
        .factory('AnonymisedTradesTableService', AnonymisedTradesTableService);

    AnonymisedTradesTableService.$inject = ['uiGridConstants', 'GridTableUtil'];

    function AnonymisedTradesTableService(uiGridConstants, GridTableUtil) {

        var tableOptions = function() {
            return {
                enableColumnMenus: false,
                enableSorting: true,
                enableFiltering: true,
                columnDefs: [
                                       {
                        field: 'referenceEntity',
                        headerCellClass: 'text-center',
                        cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope"><a href="/#/loanbook/{{row.entity.referenceEntities | listAsUrlParams}}">{{row.entity.referenceEntities | prettifyList}}</a></div>',
                        filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('', 'vm.tradesTable.filters.referenceEntities', 'vm.tradesTable.filters.filterTrades()')
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