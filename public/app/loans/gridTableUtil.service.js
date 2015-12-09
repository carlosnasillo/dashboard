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


    GridTableUtil.$inject = ['$filter'];

    function GridTableUtil($filter) {

        var datePickerOptions = { singleDatePicker: true };

        var applyDateFilter = function (startDateTerm, endDateTerm, filterKey, originalData, callback) {
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
        };

        var formatValue = function ( value1, value2, formatter ) {
            if ( value1 ) {
                return formatter ? formatter(value1) : value1;
            }
            else {
                return value2 ? "..." : "";
            }
        };

        var resetFactory = function (obj, toValue, postResetCallback) {
            if (postResetCallback) {
                return function() {
                    obj.value = toValue;
                    postResetCallback();
                };
            }
            else {
                return function() {
                    obj.value = toValue;
                };
            }
        };

        var formattedValueFactory = function (objTop, objBottom, formatter) {
            if (formatter) {
                return function() {
                    return formatValue(
                        objTop.value,
                        objBottom.value,
                        formatter
                    );
                };
            }
            else {
                return function() {
                    return formatValue(
                        objTop.value,
                        objBottom.value
                    );
                };
            }
        };

        var filterFnFactory = function (obj, filterFn) {
            return function(loanObj) {
                var filter = obj.value;
                if (filter) {
                    return filterFn(loanObj, filter);
                }
                else {
                    return true;
                }
            };
        };

        var dateFilterFactory = function(originalDate, callback, filterKey) {
            var initialValue = null;

            var start = {};
            start.value = initialValue;
            start.reset = resetFactory(start, initialValue);

            var end = {};
            end.value = initialValue;
            end.reset = resetFactory(end, initialValue);

            var formatter = function(value) { return $filter('date')(value.toDate(), 'dd/MM/yyyy'); };
            start.formattedValue = formattedValueFactory(start, end, formatter);
            end.formattedValue = formattedValueFactory(end, start, formatter);

            var filterFn = function() {
                applyDateFilter(
                    start.value,
                    end.value,
                    filterKey,
                    originalData,
                    callback);
            };

            start.filterFn = filterFn;
            end.filterFn = filterFn;

            var options = {
                singleDatePicker: true
            };

            return {start: start, end: end, options: options};
        };

        return {
            applyDateFilter: applyDateFilter,
            formatValue: formatValue,
            resetFactory: resetFactory,
            formattedValueFactory: formattedValueFactory,
            filterFnFactory: filterFnFactory,
            dateFilterFactory: dateFilterFactory,
            datePickerOptions: datePickerOptions
        };
    }
})();