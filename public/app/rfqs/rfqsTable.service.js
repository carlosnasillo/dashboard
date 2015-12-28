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
                        field: 'referenceEntity',
                        headerCellClass: 'text-center'
                    },
                    {
                        field: 'timestamp',
                        sort: { direction: uiGridConstants.DESC, priority: 0 },
                        headerCellClass: 'text-center',
                        cellFilter: 'date:"HH:mm:ss"'
                    },
                    {
                        field: 'id',
                        headerCellClass: 'text-center'
                    },
                    {
                        field: 'client',
                        headerCellClass: 'text-center',
                        visible: false
                    },
                    {
                        field: 'durationInMonths',
                        headerCellClass: 'text-center'
                    },
                    {
                        field: 'prettyDealers',
                        displayName: 'Dealers',
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
                    }
                ]
            };
        };

        return {
            options: tableOptions
        };
    }

})();