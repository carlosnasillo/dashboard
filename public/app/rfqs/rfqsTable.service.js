/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

/**
 * Created by julienderay on 13/12/2015.
 */

(function() {
    'use strict';

    angular
        .module('app')
        .factory('RfqsTableService', RfqsTableService);

    RfqsTableService.$inject = ['uiGridConstants', 'GridTableUtil'];

    function RfqsTableService(uiGridConstants, GridTableUtil) {

        var tableOptions = function() {
            return {
                enableColumnMenus: false,
                enableSorting: true,
                enableFiltering: true,
                enableRowSelection: true,
                multiSelect: false,
                modifierKeysToMultiSelect: false,
                noUnselect: true,
                enableRowHeaderSelection: false,
                columnDefs: [
                    {
                        field: 'referenceEntities',
                        headerCellClass: 'text-center',
                        cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope"><a href="/#/loanbook/{{row.entity.referenceEntities | listAsUrlParams}}">{{row.entity.referenceEntities | prettifyList}}</a></div>',
                        filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('', 'vm.rfqsTable.filters.referenceEntities', 'vm.rfqsTable.filters.filterRfqs()')
                    },
                    {
                        field: 'timestamp',
                        sort: { direction: uiGridConstants.DESC, priority: 0 },
                        headerCellClass: 'text-center',
                        cellFilter: 'date:"HH:mm:ss"',
                        filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('ex: 14:30:10', 'vm.rfqsTable.filters.timestampStr', 'vm.rfqsTable.filters.filterRfqs()')
                    },
                    {
                        field: 'id',
                        headerCellClass: 'text-center',
                        filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('', 'vm.rfqsTable.filters.id', 'vm.rfqsTable.filters.filterRfqs()')
                    },
                    {
                        field: 'durationInMonths',
                        headerCellClass: 'text-center',
                        filterHeaderTemplate: GridTableUtil.doubleNumberFilterTemplateFactory('vm.rfqsTable.filters.durationInMonths', 'vm.rfqsTable.filters.filterRfqs()')
                    },
                    {
                        field: 'dealers',
                        displayName: 'Dealers',
                        headerCellClass: 'text-center',
                        cellFilter: 'prettifyList',
                        filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('ex: dealer1, dealer2, ...', 'vm.rfqsTable.filters.dealers', 'vm.rfqsTable.filters.filterRfqs()')
                    },
                    {
                        field: 'creditEvents',
                        displayName: 'Credit Events',
                        headerCellClass: 'text-center',
                        cellFilter: 'prettifyList',
                        filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('ex: default, ...', 'vm.rfqsTable.filters.creditEvents', 'vm.rfqsTable.filters.filterRfqs()')
                    },
                    {
                        field: 'timeout',
                        displayName: 'Timeout in seconds',
                        type: 'text',
                        headerCellClass: 'text-center',
                        filterHeaderTemplate: GridTableUtil.doubleNumberFilterTemplateFactory('vm.rfqsTable.filters.timeout', 'vm.rfqsTable.filters.filterRfqs()')
                    },
                    {
                        field: 'cdsValue',
                        headerCellClass: 'text-center',
                        filterHeaderTemplate: GridTableUtil.doubleNumberFilterTemplateFactory('vm.rfqsTable.filters.cdsValue', 'vm.rfqsTable.filters.filterRfqs()')
                    }
                ]
            };
        };

        return {
            options: tableOptions
        };
    }

})();