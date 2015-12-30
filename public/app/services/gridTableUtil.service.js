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

        var singleFilterFactory = function(postResetCallback, filterFn) {
            var initialValue = "";

            var gradeFilter = {};
            gradeFilter.value = initialValue;
            gradeFilter.reset = resetFactory(gradeFilter, initialValue, postResetCallback);
            gradeFilter.filterFn = filterFnFactory(gradeFilter, filterFn);

            return gradeFilter;
        };

        var doubleFilterFactory = function(postResetCallback, filterFnStart, filterFnEnd, formatter) {
            var initialValue = "";

            var start = {};
            start.value = initialValue;
            start.reset = resetFactory(start, initialValue, postResetCallback);

            var end = {};
            end.value = initialValue;
            end.reset = resetFactory(end, initialValue, postResetCallback);

            if (formatter) {
                start.formattedValue = formattedValueFactory(start, end, formatter);
                end.formattedValue = formattedValueFactory(end, start, formatter);
            }
            else {
                start.formattedValue = formattedValueFactory(start, end);
                end.formattedValue = formattedValueFactory(end, start);
            }

            start.filterFn = filterFnFactory(start, filterFnStart);
            end.filterFn = filterFnFactory(end, filterFnEnd);

            return { start: start, end: end };
        };

        var textFilterTemplateFactory = function(placeholder, filter, filterFn) { return '<div class="ui-grid-filter-container text-left" ng-repeat="colFilter in col.filters"> <i class="fa fa-filter" ns-popover ns-popover-timeout="-1" ns-popover-template=\'<div class="ns-popover-tooltip"><div class="triangle"></div><ul><li><div class="row"><input class="col-md-offset-1 col-md-8" type="text" placeholder="' + placeholder + '" data-ng-model="col.grid.appScope.' + filter + '.value" data-ng-change="col.grid.appScope.' + filterFn + '" /> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.' + filter + '.reset()" > <i class="ui-grid-icon-cancel"></i> </button></div></li></ul></div>\' ns-popover-trigger="click" ns-popover-placement="top|left" ns-popover-plain="true"></i> <span class="header-filtered">{{ col.grid.appScope.' + filter + '.value }}</span> </div>'; };

        var dateFilterTemplateFactory = function(filter) { return '<div class="ui-grid-filter-container text-left" ng-repeat="colFilter in col.filters"> <div class="row"> <span class="col-md-1"><i class="fa fa-filter" ns-popover ns-popover-timeout="-1" ns-popover-template=\'<div class="ns-popover-tooltip"><div class="triangle"></div><ul><li><div class="row"><input date-range-picker placeholder="greater than ..." class="date-picker col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.' + filter + '.start.value" max="col.grid.appScope.' + filter + '.end.value" options="col.grid.appScope.' + filter + '.options" /> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.' + filter + '.start.reset()" > <i class="ui-grid-icon-cancel"></i> </button> </div> <div class="row"> <input date-range-picker placeholder="less than ..." class="date-picker col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.' + filter + '.end.value" min="col.grid.appScope.' + filter + '.start.value" options="col.grid.appScope.' + filter + '.options"/> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.' + filter + '.end.reset()" > <i class="ui-grid-icon-cancel"></i> </button></div></li></ul></div>\' ns-popover-trigger="click" ns-popover-placement="top|left" ns-popover-plain="true" ></i></span> <span class="header-filtered col-md-8">{{ col.grid.appScope.' + filter + '.start.formattedValue() }}</span></div> <div class="row"><span class="header-filtered col-md-offset-2 col-md-8">{{ col.grid.appScope.' + filter + '.end.formattedValue() }}</span></div> </div>'; };

        var doubleNumberFilterTemplateFactory = function(filter, filterFn) { return '<div class="ui-grid-filter-container text-left" ng-repeat="colFilter in col.filters"> <div class="row"> <span class="col-md-1"><i class="fa fa-filter" ns-popover ns-popover-timeout="-1" ns-popover-template=\'<div class="ns-popover-tooltip"><div class="triangle"></div><ul><li><div class="row"><input placeholder="greater than ..." class="col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.' + filter + '.start.value" data-ng-change="col.grid.appScope.' + filterFn + '"/> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.' + filter + '.start.reset()" > <i class="ui-grid-icon-cancel"></i> </button> </div> <div class="row"> <input placeholder="less than ..." class="col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.' + filter + '.end.value" data-ng-change="col.grid.appScope.' + filterFn + '" /> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.' + filter + '.end.reset()" >  <i class="ui-grid-icon-cancel"></i> </button></div></li></ul></div>\' ns-popover-trigger="click" ns-popover-placement="top|left" ns-popover-plain="true"  ></i> </span> <span class="header-filtered col-md-8">{{ col.grid.appScope.' + filter + '.start.formattedValue() }}</span></div> <div class="row"><span class="header-filtered col-md-offset-2 col-md-8">{{ col.grid.appScope.' + filter + '.end.formattedValue() }}</span></div> </div>';} ;

        var doublePercentFilterTemplateFactory = function(filter, filterFn) { return '<div class="ui-grid-filter-container text-left" ng-repeat="colFilter in col.filters"> <div class="row"> <span class="col-md-1"><i class="fa fa-filter" ns-popover ns-popover-timeout="-1" ns-popover-template=\'<div class="ns-popover-tooltip"><div class="triangle"></div><ul><li><div class="row"><input placeholder="greater than (%)" class="col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.' + filter + '.start.value" data-ng-change="col.grid.appScope.' + filterFn + '"/> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.' + filter + '.start.reset()" > <i class="ui-grid-icon-cancel"></i> </button> </div> <div class="row"> <input placeholder="less than (%)" class="col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.' + filter + '.end.value" data-ng-change="col.grid.appScope.' + filterFn + '" /> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.' + filter + '.end.reset()" >  <i class="ui-grid-icon-cancel"></i> </button></div></li></ul></div>\' ns-popover-trigger="click" ns-popover-placement="top|left" ns-popover-plain="true"  ></i> </span> <span class="header-filtered col-md-8">{{ col.grid.appScope.' + filter + '.start.formattedValue() }}</span></div> <div class="row"><span class="header-filtered col-md-offset-2 col-md-8">{{ col.grid.appScope.' + filter + '.end.formattedValue() }}</span></div> </div>'; };

        var idFilterFactory = function(postResetCallback, filter) {
            return singleFilterFactory(
                postResetCallback,
                function(objToFilter, filterTerm) { return String( objToFilter[filter] ).startsWith( filterTerm ); }
            );
        };

        var doubleNumberFilterFactory = function(postResetCallback, filter) {
            return doubleFilterFactory(
                postResetCallback,
                function(objToFilter, filterTerm) { return objToFilter[filter] > filterTerm; },
                function(objToFilter, filterTerm) { return objToFilter[filter] < filterTerm; }
            );
        };

        var doublePercentFilterFactory = function(postResetCallback, filter) {
            return doubleFilterFactory(
                postResetCallback,
                function(objToFilter, filterTerm) { return objToFilter[filter] > filterTerm; },
                function(objToFilter, filterTerm) { return objToFilter[filter] < filterTerm; },
                function(value) { return value + ' %'; }
            );
        };

        var textFilterFactory = function(postResetCallback, filter) {
            return singleFilterFactory(
                postResetCallback,
                function(objToFilter, filterTerm) {
                    var searchTerms = filterTerm.split(',').map(function(search) { return search.trim(); });
                    for (var i in searchTerms) {
                        if ( searchTerms.hasOwnProperty(i) && searchTerms[i].length > 0) {
                            if (objToFilter[filter].startsWith(searchTerms[i])) return true;
                        }
                    }
                    return false;
                }
            );
        };

        var wordFilterFactory = function(postResetCallback, filter) {
            return singleFilterFactory(
                postResetCallback,
                function(objToFilter, filterTerm) { return filterTerm.split(',').map(function(search) { return search.trim(); }).indexOf(objToFilter[filter]) >= 0; }
            );
        };

        var listFilterFactory = function(postResetCallback, filter) {
            return singleFilterFactory(
                postResetCallback,
                function(arrayToFilter, filterTerm) {
                    var termAsArray = filterTerm.split(',');
                    return arrayToFilter[filter].some(function(tableElem) {
                        return termAsArray.some(function(term) {
                            return tableElem.startsWith(term);
                        });
                    });
                }
            );
        };

        return  {
            applyDateFilter: applyDateFilter,
            formatValue: formatValue,
            resetFactory: resetFactory,
            formattedValueFactory: formattedValueFactory,
            filterFnFactory: filterFnFactory,
            dateFilterFactory: dateFilterFactory,
            singleFilterFactory: singleFilterFactory,
            doubleFilterFactory: doubleFilterFactory,
            datePickerOptions: datePickerOptions,
            textFilterTemplateFactory: textFilterTemplateFactory,
            dateFilterTemplateFactory: dateFilterTemplateFactory,
            doubleNumberFilterTemplateFactory: doubleNumberFilterTemplateFactory,
            doublePercentFilterTemplateFactory: doublePercentFilterTemplateFactory,
            idFilterFactory: idFilterFactory,
            doubleNumberFilterFactory: doubleNumberFilterFactory,
            doublePercentFilterFactory: doublePercentFilterFactory,
            textFilterFactory: textFilterFactory,
            wordFilterFactory: wordFilterFactory,
            listFilterFactory: listFilterFactory
        };
    }
})();