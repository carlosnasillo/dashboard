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
* Created on 14/12/2015
*/

(function() {
    'use strict';

    angular
        .module('app')
        .factory('TradesTableService', TradesTableService);

    TradesTableService.$inject = ['uiGridConstants'];

    function TradesTableService(uiGridConstants) {

        var tableOptions = function() {
            return {
                enableColumnMenus: false,
                enableSorting: true,
                enableFiltering: true,
                columnDefs: [
                    {
                       field: 'id',
                        headerCellClass: 'text-center'
                    },
                    {
                        field: 'rfqId',
                        headerCellClass: 'text-center'
                    },
                    {
                        field: 'quoteId',
                        headerCellClass: 'text-center'
                    },
                    {
                        field: 'timestamp',
                        displayName: 'Created on',
                        cellFilter: 'date:"dd/MM/yyyy"',
                        sort: { direction: uiGridConstants.DESC, priority: 0 },
                        headerCellClass: 'text-center'
                    },
                    {
                        field: 'durationInMonths',
                        headerCellClass: 'text-center'
                    },
                    {
                        field: 'creditEvents',
                        headerCellClass: 'text-center'
                    },
                    {
                        field: 'cdsValue',
                        headerCellClass: 'text-center'
                    },
                    {
                        field: 'originator',
                        headerCellClass: 'text-center'
                    },
                    {
                        field: 'premium',
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