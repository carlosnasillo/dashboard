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
* Created on 11/12/2015
*/

(function() {
    'use strict';

    angular
        .module('app')
        .factory('RfqsTableForDealerService', RfqsTableForDealerService);

    RfqsTableForDealerService.$inject = ['uiGridConstants', 'GridTableUtil'];

    function RfqsTableForDealerService(uiGridConstants, GridTableUtil) {

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
                        field: 'timestamp',
                        sort: { direction: uiGridConstants.DESC, priority: 0 },
                        headerCellClass: 'text-center',
                        cellFilter: 'date:"HH:mm:ss"',
                        filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('ex: 14:30:10', 'vm.rfqTable.filters.timestampStr', 'vm.rfqTable.filters.filterRfqs()')
                    },
                    {
                        field: 'referenceEntities',
                        headerCellClass: 'text-center',
                        cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope"><a href="/#/loanbook/{{row.entity.referenceEntities | listAsUrlParams}}">{{row.entity.referenceEntities | prettifyList}}</a></div>',
                        filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('', 'vm.rfqTable.filters.referenceEntities', 'vm.rfqTable.filters.filterRfqs()')
                    },
                    {
                        field: 'client.account',
                        displayName: 'Client',
                        headerCellClass: 'text-center',
                        filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('ex: Dealer1, ...', 'vm.rfqTable.filters.client', 'vm.rfqTable.filters.filterRfqs()')
                    },
                    {
                        field: 'durationInMonths',
                        headerCellClass: 'text-center',
                        filterHeaderTemplate: GridTableUtil.doubleNumberFilterTemplateFactory('vm.rfqTable.filters.durationInMonths', 'vm.rfqTable.filters.filterRfqs()')
                    },
                    {
                        field: 'creditEvents',
                        displayName: 'Credit Events',
                        headerCellClass: 'text-center',
                        cellFilter: 'prettifyList',
                        filterHeaderTemplate: GridTableUtil.textFilterTemplateFactory('ex: default, ...', 'vm.rfqTable.filters.creditEvents', 'vm.rfqTable.filters.filterRfqs()')
                    },
                    {
                        field: 'timeout',
                        displayName: 'Timeout in seconds',
                        type: 'text',
                        headerCellClass: 'text-center',
                        filterHeaderTemplate: GridTableUtil.doubleNumberFilterTemplateFactory('vm.rfqTable.filters.timeout', 'vm.rfqTable.filters.filterRfqs()')
                    },
                    {
                        field: 'cdsValue',
                        headerCellClass: 'text-center',
                        filterHeaderTemplate: GridTableUtil.doubleNumberFilterTemplateFactory('vm.rfqTable.filters.cdsValue', 'vm.rfqTable.filters.filterRfqs()')
                    },
                    {
                        field: 'id',
                        displayName: 'Quote',
                        cellTemplate: "<div class='ui-grid-cell-contents ng-binding ng-scope'><div class='text-center'><button class='btn btn-primary btn-xs' data-ng-disabled='row.grid.appScope.vm.isExpired(row.entity.timeout)' data-ng-click='row.grid.appScope.vm.quote(row.entity.referenceEntities, row.entity.id, row.entity.client, row.entity.timeout)'>Quote</button></div></div>",
                        enableFiltering: false,
                        headerCellClass: 'text-center'
                    }
                ]
            };
        };

        return {
            options: tableOptions
        };
    }

})();