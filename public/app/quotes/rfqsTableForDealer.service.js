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

        var tableOptions = function(onRegisterApi) {
            return {
                enableColumnMenus: false,
                    enableSorting: true,
                enableFiltering: true,
                onRegisterApi: onRegisterApi,
                columnDefs: [
                    {
                        field: 'timestamp',
                        sort: { direction: uiGridConstants.DESC, priority: 0 },
                        visible: false
                    },
                    {
                        field: 'client'
                    },
                    {
                        field: 'durationInMonths'
                    },
                    {
                        field: 'prettyDealers'
                    },
                    {
                        field: 'prettyCreditEvents'
                    },
                    {
                        field: 'timeout',
                        displayName: 'Timeout in seconds',
                        type: 'text'
                    },
                    {
                        field: 'cdsValue'
                    },
                    {
                        field: 'id',
                        displayName: 'Quote',
                        cellTemplate: "<div class='text-center'><button class='btn btn-primary btn-xs' data-ng-disabled='row.grid.appScope.vm.isExpired(row.entity.timeout)' data-ng-click='row.grid.appScope.vm.quote(row.entity.loanId, row.entity.originator, row.entity.id, row.entity.timestamp, row.entity.client, row.entity.timeout)'>Quote</button></div>",
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