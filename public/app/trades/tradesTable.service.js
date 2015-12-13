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
                       field: 'id'
                    },
                    {
                        field: 'rfqId'
                    },
                    {
                        field: 'quoteId'
                    },
                    {
                        field: 'timestamp',
                        displayName: 'Created on',
                        cellFilter: 'date:"dd/MM/yyyy"',
                        sort: { direction: uiGridConstants.DESC, priority: 0 }
                    },
                    {
                        field: 'durationInMonths'
                    },
                    {
                        field: 'creditEvents'
                    },
                    {
                        field: 'cdsValue'
                    },
                    {
                        field: 'originator'
                    },
                    {
                        field: 'premium'
                    }
                ]
            };
        };

        return {
            options: tableOptions
        };
    }

})();