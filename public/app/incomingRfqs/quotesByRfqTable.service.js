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

    QuotesByRfqTableService.$inject = ['uiGridConstants'];

    function QuotesByRfqTableService(uiGridConstants) {
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
                        field: 'client',
                        headerCellClass: 'text-center'
                    },
                    {
                        field: 'timestamp',
                        sort: { direction: uiGridConstants.DESC, priority: 0 },
                        headerCellClass: 'text-center',
                        cellFilter: 'date:"hh:mm:ss"'
                    },
                    {
                        field: 'premium',
                        headerCellClass: 'text-center'
                    },
                    {
                        field: 'timeout',
                        displayName: 'Timeout in seconds',
                        type: 'text',
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