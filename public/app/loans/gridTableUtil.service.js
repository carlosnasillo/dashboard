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
        .factory('GridTableUtil', GridTableUtil);


    GridTableUtil.$inject = [];

    function GridTableUtil() {

        return {
            highlightFilteredHeader: highlightFilteredHeader,
            applyDateFilter: applyDateFilter
        };

        function highlightFilteredHeader( row, rowRenderIndex, col ) {
            if ( col.filters[0].term ) {
                return 'header-filtered';
            } else {
                return '';
            }
        }

        function applyDateFilter(startDateTerm, endDateTerm, filterKey, originalData, callback) {
            var data = originalData;

            var gt = function(cellDate, filterDate) { return cellDate >= filterDate; };
            var lt = function(cellDate, filterDate) { return cellDate <= filterDate; };

            data = dateFilter(gt, startDateTerm, data);
            data = dateFilter(lt, endDateTerm, data);

            callback(data);

            function dateFilter(filter, newDate, data) {
                if ( newDate !== null ) {
                    var searchDate = newDate.toDate();
                    return data.filter(function(loanObj) {
                        var cellDate = parseEuDate(loanObj[filterKey]);

                        return filter(cellDate, searchDate);
                    });
                }
                else {
                    return data;
                }
            }

            function parseEuDate(str) {
                var parts = str.split("/");
                return new Date(parseInt(parts[2], 10),
                    parseInt(parts[1], 10) - 1,
                    parseInt(parts[0], 10));
            }
        }

    }
})();