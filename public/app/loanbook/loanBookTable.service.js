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
* Created on 19/11/2015
*/

(function() {
    'use strict';

    angular
        .module('app')
        .factory('LoanBookTableService', LoanBookTableService);


    LoanBookTableService.$inject = [];

    function LoanBookTableService() {
        var tableOptions = {
            enableColumnMenus: false,
            enableSorting: true,
            enableFiltering: true,
            columnDefs: [
                {
                    field: 'originator',
                    headerCellClass: 'text-center'
                },
                {
                    field: 'status',
                    headerCellClass: 'text-center'
                },
                {
                    field: 'grade',
                    headerCellClass: 'text-center'
                },
                {
                    field: 'purpose',
                    headerCellClass: 'text-center'
                },
                {
                    field: 'sector',
                    headerCellClass: 'text-center'
                },
                {
                    field: 'type',
                    headerCellClass: 'text-center'
                },
                {
                    field: 'region',
                    headerCellClass: 'text-center'
                },
                {
                    field: 'amount',
                    headerCellClass: 'text-center'
                },
                {
                    field: 'interest',
                    headerCellClass: 'text-center',
                    cellFilter: 'percentage:2'
                },
                {
                    field: 'term',
                    headerCellClass: 'text-center'
                },
                {
                    field: 'loanDate',
                    headerCellClass: 'text-center'
                },
                {
                    field: 'security',
                    headerCellClass: 'text-center'
                },
                {
                    field: 'id',
                    headerCellClass: 'text-center',
                    displayName: 'RFQ',
                    cellTemplate: "<div class='text-center'><span class='label label-primary' data-ng-click='row.grid.appScope.vm.order(row.entity.id, row.entity.originator)'>RFQ</span></div>",
                    enableFiltering: false
                }
            ]
        };

        return {
            options: tableOptions
        };
    }
})();
