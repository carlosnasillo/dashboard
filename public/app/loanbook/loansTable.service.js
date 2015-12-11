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
                    field: 'originator'
                },
                {
                    field: 'status'
                },
                {
                    field: 'grade'
                },
                {
                    field: 'purpose'
                },
                {
                    field: 'sector'
                },
                {
                    field: 'type'
                },
                {
                    field: 'region'
                },
                {
                    field: 'amount'
                },
                {
                    field: 'interest'
                },
                {
                    field: 'term'
                },
                {
                    field: 'loanDate'
                },
                {
                    field: 'security'
                }
            ]
        };

        return {
            options: tableOptions
        };
    }
})();
