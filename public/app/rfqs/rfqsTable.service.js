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

    RfqsTableService.$inject = ['uiGridConstants'];

    function RfqsTableService(uiGridConstants) {

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
                        visible: false
                    },
                    {
                        field: 'client'
                    },
                    {
                        field: 'duration',
                        displayName: 'Duration in Months'
                    },
                    {
                        field: 'dealers'
                    },
                    {
                        field: 'creditEvents'
                    },
                    {
                        field: 'timeout',
                        displayName: 'Timeout in seconds',
                        type: 'text'
                    },
                    {
                        field: 'cdsValue'
                    }
                ]
            };
        };

        return {
            options: tableOptions
        };
    }

})();