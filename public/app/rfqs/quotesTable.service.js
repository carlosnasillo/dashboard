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
* Created on 13/12/2015
*/

(function() {
    'use strict';

    angular
        .module('app')
        .factory('QuotesTableService', QuotesTableService);

    QuotesTableService.$inject = ['uiGridConstants'];

    function QuotesTableService(uiGridConstants) {

        var tableOptions = function() {
            return {
                enableColumnMenus: false,
                enableSorting: true,
                enableFiltering: true,
                columnDefs: [
                    {
                        field: 'timestamp',
                        sort: { direction: uiGridConstants.DESC, priority: 0 },
                        visible: false
                    },
                    {
                        field: 'id'
                    },
                    {
                        field: 'dealer',
                        displayName: 'Counterparty'
                    },
                    {
                        field: 'premium'
                    },
                    {
                        field: 'timeout',
                        displayName: 'Timeout in seconds',
                        type: 'text'
                    },
                    {
                        field: 'id',
                        displayName: 'Accept',
                        cellTemplate: "<div class='text-center'><button class='btn btn-primary btn-xs' data-ng-disabled='row.grid.appScope.vm.isExpired(row.entity.timeout)' data-ng-click='row.grid.appScope.vm.accept(row.entity.id)'>Accept</button><div data-ng-show='row.grid.appScope.vm.loading' class='sk-spinner sk-spinner-double-bounce'> <div class='sk-double-bounce1'></div> <div class='sk-double-bounce2'></div> </div></div>",
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