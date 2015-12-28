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
* Created on 11/12/2015
*/

(function() {
    'use strict';

    angular
        .module('app')
        .factory('RfqsTableForDealerService', RfqsTableForDealerService);

    RfqsTableForDealerService.$inject = ['uiGridConstants'];

    function RfqsTableForDealerService(uiGridConstants) {

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
                        cellFilter: 'date:"HH:mm:ss"'
                    },
                    {
                        field: 'referenceEntity',
                        headerCellClass: 'text-center',
                        cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope"><a href="/#/loanbook/{{row.entity.referenceEntity}}">{{row.entity.referenceEntity}}</a></div>'
                    },
                    {
                        field: 'client',
                        headerCellClass: 'text-center'
                    },
                    {
                        field: 'durationInMonths',
                        headerCellClass: 'text-center'
                    },
                    {
                        field: 'prettyCreditEvents',
                        displayName: 'Credit Events',
                        headerCellClass: 'text-center'
                    },
                    {
                        field: 'timeout',
                        displayName: 'Timeout in seconds',
                        type: 'text',
                        headerCellClass: 'text-center'
                    },
                    {
                        field: 'cdsValue',
                        headerCellClass: 'text-center'
                    },
                    {
                        field: 'id',
                        displayName: 'Quote',
                        cellTemplate: "<div class='ui-grid-cell-contents ng-binding ng-scope'><div class='text-center'><button class='btn btn-primary btn-xs' data-ng-disabled='row.grid.appScope.vm.isExpired(row.entity.timeout)' data-ng-click='row.grid.appScope.vm.quote(row.entity.referenceEntity, row.entity.originator, row.entity.id, row.entity.client, row.entity.timeout)'>Quote</button></div></div>",
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