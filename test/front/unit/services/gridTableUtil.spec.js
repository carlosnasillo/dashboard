/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

/**
* @author : julienderay
* Created on 21/01/2016
*/

describe('GridTableUtil', function() {

    var gridTableUtil;

    beforeEach(function() {
        module('app');
    });

    beforeEach(inject(function(GridTableUtil) {
        gridTableUtil = GridTableUtil;

    }));

    describe('applyDateFilter', function() {
        it('should do return the dates between the limits given', function() {
            var before = { mockDate: '01/05/1992'};
            var lowerLimit = { mockDate: '11/05/1992'};
            var between = { mockDate: '15/05/1992'};
            var upperLimit = { mockDate: '20/05/1992'};
            var after = { mockDate: '25/05/1992'};

            var mockDates = [ before, lowerLimit, between, upperLimit, after ];

            gridTableUtil.applyDateFilter(
                moment(new Date('05/11/1992')),
                moment(new Date('05/20/1992')),
                'mockDate',
                mockDates,
                function (filteredData) {
                    expect(filteredData).not.toContain(before);
                    expect(filteredData).toContain(lowerLimit);
                    expect(filteredData).toContain(between);
                    expect(filteredData).toContain(upperLimit);
                    expect(filteredData).not.toContain(after);
                });
        });

        it('should not return invalid dates', function() {
            var validDate = { mockDate: '11/05/1992'};
            var invalidDate1 = { mockDate: '01/31/1992'};
            var invalidDate2 = { mockDate: ''};

            var mockDates = [ validDate, invalidDate1, invalidDate2 ];

            gridTableUtil.applyDateFilter(
                moment(new Date('05/01/1992')),
                moment(new Date('05/20/1992')),
                'mockDate',
                mockDates,
                function (filteredData) {
                    expect(filteredData).toContain(validDate);
                    expect(filteredData).not.toContain(invalidDate1);
                    expect(filteredData).not.toContain(invalidDate2);
                });
        });

        it('should return an empty array when there is no date', function() {
            var emptyDateArray = [];

            gridTableUtil.applyDateFilter(
                moment(new Date('05/01/1992')),
                moment(new Date('05/20/1992')),
                'mockDate',
                emptyDateArray,
                function (filteredData) {
                    expect(filteredData).toEqual([]);
                });
        });
    });

    describe('formatValue', function() {
        it('should format the value with the given formatter', function() {
            var value1 = "abcd",
                value2 = "efgh",
                formatter = function(str) { return str.toUpperCase(); };

            var formattedValue = gridTableUtil.formatValue(value1, value2, formatter);

            expect(formattedValue).toBe("ABCD");
        });

        it('should return suspension points', function() {
            var value2 = "abdc";

            var suspensionPoints = gridTableUtil.formatValue(null, value2);

            expect(suspensionPoints).toBe('...');
        });

        it('should return a empty string', function() {
            var emptyString = gridTableUtil.formatValue(null, null);

            expect(emptyString).toBe('');
        });

        it('should return the first value unformatted', function() {
            var value1 = "abcd",
                value2 = "efgh";

            var unformattedValue = gridTableUtil.formatValue(value1, value2);

            expect(unformattedValue).toBe(value1);
        });
    });

    describe('resetFactory', function() {
        var obj, toValue;

        beforeEach(function() {
            obj = { value: 'a'};
            toValue = 'b';
        });

        it('should return a reset function with callback', function() {
            var postResetCallback = jasmine.createSpy('postResetCallback');

            var resetFunction = gridTableUtil.resetFactory(obj, toValue, postResetCallback);
            resetFunction();

            expect(postResetCallback).toHaveBeenCalled();
            expect(obj.value).toBe(toValue);
        });

        it('should return a reset function withou callback', function() {
            var resetFunction = gridTableUtil.resetFactory(obj, toValue);
            resetFunction();

            expect(obj.value).toBe(toValue);
        });
    });

    describe('formattedValueFactory', function() {
        var objTop,
            objBottom;

        beforeEach(function() {
            objTop = { value: 'top' };
            objBottom = { value: 'bottom' };
        });

        it('should return a function calling formatValue with a formatter', function() {
            var formatter = function(str) { return str.toUpperCase(); };

            var formatValue = gridTableUtil.formattedValueFactory(objTop, objBottom, formatter);

            var formattedValue = formatValue();
            expect(formattedValue).toBe('TOP');

            objTop.value = null;

            formattedValue = formatValue();
            expect(formattedValue).toBe('...');

            objBottom.value = null;

            formattedValue = formatValue();
            expect(formattedValue).toBe('');
        });

        it('should return a function calling formatValue without formatter', function() {
            var formatValue = gridTableUtil.formattedValueFactory(objTop, objBottom);

            var formattedValue = formatValue();
            expect(formattedValue).toBe('top');

            objTop.value = null;

            formattedValue = formatValue();
            expect(formattedValue).toBe('...');

            objBottom.value = null;

            formattedValue = formatValue();
            expect(formattedValue).toBe('');
        });
    });

    describe('filterFnFactory', function() {
        it('should return the result of the filter function', function() {
            var obj = { value: 'a' },
                filterFn = jasmine.createSpy('filterFn').and.returnValue(false),
                mockObj = jasmine.any(Object);

            var loanFilter = gridTableUtil.filterFnFactory(obj, filterFn);
            var result = loanFilter(mockObj);

            expect(result).toBeFalsy();
            expect(filterFn).toHaveBeenCalledWith(mockObj, obj.value);
        });

        it('should return true', function() {
            var obj = { value: null },
                filterFn = jasmine.createSpy('filterFn').and.returnValue(false),
                mockObj = jasmine.any(Object);

            var loanFilter = gridTableUtil.filterFnFactory(obj, filterFn);
            var result = loanFilter(mockObj);

            expect(result).toBeTruthy();
            expect(filterFn).not.toHaveBeenCalled()
        });
    });

    describe('dateFilterFactory', function() {
        var before,
            lowerLimit,
            between,
            upperLimit,
            after,
            originalMockDates,
            filterKey;

        beforeEach(function() {
            before = { mockDate: '01/05/1992'};
            lowerLimit = { mockDate: '11/05/1992'};
            between = { mockDate: '15/05/1992'};
            upperLimit = { mockDate: '20/05/1992'};
            after = { mockDate: '25/05/1992'};
            originalMockDates = [ before, lowerLimit, between, upperLimit, after];
            filterKey = 'mockDate';
        });

        it('should initialize the two values with null', function() {
            var callback = function(filteredData) {
                expect(filteredData).toEqual(originalMockDates);
            };

            var dateFilter = gridTableUtil.dateFilterFactory(originalMockDates, callback, filterKey);

            expect(dateFilter.start.value).toBeNull();
            expect(dateFilter.end.value).toBeNull();
        });

        it('should not filter any date', function() {
            var callback = function(filteredData) {
                expect(filteredData).toEqual(originalMockDates);
            };

            var dateFilter = gridTableUtil.dateFilterFactory(originalMockDates, callback, filterKey);

            dateFilter.start.filterFn();
            dateFilter.end.filterFn();
        });

        it('should filter two dates (lowerLimit)', function() {
            var callback = function(filteredData) {
                expect(filteredData).toEqual([between, upperLimit, after]);
            };

            var dateFilter = gridTableUtil.dateFilterFactory(originalMockDates, callback, filterKey);

            dateFilter.start.value = moment(new Date('05/12/1992'));
            dateFilter.start.filterFn();
            dateFilter.end.filterFn();
        });

        it('should filter three dates (upperLimit)', function() {
            var callback = function(filteredData) {
                expect(filteredData).toEqual([before, lowerLimit]);
            };

            var dateFilter = gridTableUtil.dateFilterFactory(originalMockDates, callback, filterKey);

            dateFilter.end.value = moment(new Date('05/12/1992'));
            dateFilter.start.filterFn();
            dateFilter.end.filterFn();
        });

        it('should filter four dates (both limits)', function() {
            var callback = function(filteredData) {
                expect(filteredData).toEqual([ between ]);
            };

            var dateFilter = gridTableUtil.dateFilterFactory(originalMockDates, callback, filterKey);

            dateFilter.start.value = moment(new Date('05/12/1992'));
            dateFilter.end.value = moment(new Date('05/16/1992'));
            dateFilter.start.filterFn();
            dateFilter.end.filterFn();
        });

        it('should reset start value', function() {
            var callback = jasmine.createSpy('callback');

            var dateFilter = gridTableUtil.dateFilterFactory(originalMockDates, callback, filterKey);

            dateFilter.start.value = moment(new Date('05/12/1992'));
            expect(dateFilter.start.value).not.toBeNull();

            dateFilter.start.reset();
            expect(dateFilter.start.value).toBeNull();
        });

        it('should reset end value', function() {
            var callback = jasmine.createSpy('callback');

            var dateFilter = gridTableUtil.dateFilterFactory(originalMockDates, callback, filterKey);

            dateFilter.end.value = moment(new Date('05/12/1992'));
            expect(dateFilter.end.value).not.toBeNull();

            dateFilter.end.reset();
            expect(dateFilter.end.value).toBeNull();
        });

        it('should format start value', function() {
            var callback = jasmine.createSpy('callback');

            var dateFilter = gridTableUtil.dateFilterFactory(originalMockDates, callback, filterKey);

            dateFilter.start.value = moment(new Date('05/12/1992'));
            expect(dateFilter.start.formattedValue()).toBe('12/05/1992');
        });

        it('should format end value', function() {
            var callback = jasmine.createSpy('callback');

            var dateFilter = gridTableUtil.dateFilterFactory(originalMockDates, callback, filterKey);

            dateFilter.end.value = moment(new Date('05/24/1992'));
            expect(dateFilter.end.formattedValue()).toBe('24/05/1992');
        });
    });

    describe('singleFilterFactory', function() {
        var postResetCallback,
            filterFn;

        beforeEach(function() {
            postResetCallback = jasmine.createSpy('postResetCallback');
            filterFn = jasmine.createSpy('filterFn');
        });

        it('should initialize the value', function() {
            var filter = gridTableUtil.singleFilterFactory(postResetCallback, filterFn);

            expect(filter.value).toBe('');
        });

        it('should reset the filter', function() {
            var filter = gridTableUtil.singleFilterFactory(postResetCallback, filterFn);

            var value = jasmine.any(String);

            filter.value = value;
            expect(filter.value).toBe(value);

            filter.reset();
            expect(filter.value).toBe('');

            expect(postResetCallback).toHaveBeenCalled();
        });

        it('should not filter the loans', function() {
            var value = jasmine.any(String),
                mockObj = jasmine.any(Object);
            filterFn.and.returnValue(true);

            var filter = gridTableUtil.singleFilterFactory(postResetCallback, filterFn);
            filter.value = value;

            var result = filter.filterFn(mockObj);
            expect(result).toBeTruthy();
        });

        it('should filter the loans', function() {
            var value = jasmine.any(String),
                mockObj = jasmine.any(Object);
            filterFn.and.returnValue(false);

            var filter = gridTableUtil.singleFilterFactory(postResetCallback, filterFn);
            filter.value = value;

            var result = filter.filterFn(mockObj);
            expect(result).toBeFalsy();
        });
    });

    describe('doubleFilterFactory', function() {
        var postResetCallback,
            filterFnStart,
            filterFnEnd;

        beforeEach(function() {
            postResetCallback = jasmine.createSpy('postResetCallback');
            filterFnStart = jasmine.createSpy('filterFnStart');
            filterFnEnd = jasmine.createSpy('filterFnEnd');
        });

        it('should should initialize the values', function() {
            var filter = gridTableUtil.doubleFilterFactory(postResetCallback, filterFnStart, filterFnEnd);

            expect(filter.start.value).toBe('');
            expect(filter.end.value).toBe('');
        });

        it('should should reset the values', function() {
            var filter = gridTableUtil.doubleFilterFactory(postResetCallback, filterFnStart, filterFnEnd);

            filter.start.value = jasmine.any(String);
            filter.end.value = jasmine.any(String);

            filter.start.reset();
            expect(filter.start.value).toBe('');

            filter.end.reset();
            expect(filter.end.value).toBe('');

            expect(postResetCallback).toHaveBeenCalled();
        });

        it('should not filter any values', function() {
            var startValue = jasmine.any(String),
                endValue = jasmine.any(String),
                mockObj = jasmine.any(Object);

            filterFnStart.and.returnValue(false);
            filterFnEnd.and.returnValue(false);

            var filter = gridTableUtil.doubleFilterFactory(postResetCallback, filterFnStart, filterFnEnd);

            filter.start.value = startValue;
            filter.end.value = endValue;

            var startResult = filter.start.filterFn(mockObj);
            var endResult = filter.end.filterFn(mockObj);

            expect(startResult).toBeFalsy();
            expect(endResult).toBeFalsy();
        });

        it('should filter only start value', function() {
            var startValue = jasmine.any(String),
                endValue = jasmine.any(String),
                mockObj = jasmine.any(Object);

            filterFnStart.and.returnValue(true);
            filterFnEnd.and.returnValue(false);

            var filter = gridTableUtil.doubleFilterFactory(postResetCallback, filterFnStart, filterFnEnd);

            filter.start.value = startValue;
            filter.end.value = endValue;

            var startResult = filter.start.filterFn(mockObj);
            var endResult = filter.end.filterFn(mockObj);

            expect(startResult).toBeTruthy();
            expect(endResult).toBeFalsy();
        });

        it('should filter only end value', function() {
            var startValue = jasmine.any(String),
                endValue = jasmine.any(String),
                mockObj = jasmine.any(Object);

            filterFnStart.and.returnValue(false);
            filterFnEnd.and.returnValue(true);

            var filter = gridTableUtil.doubleFilterFactory(postResetCallback, filterFnStart, filterFnEnd);

            filter.start.value = startValue;
            filter.end.value = endValue;

            var startResult = filter.start.filterFn(mockObj);
            var endResult = filter.end.filterFn(mockObj);

            expect(startResult).toBeFalsy();
            expect(endResult).toBeTruthy();
        });

        it('should filter both values', function() {
            var startValue = jasmine.any(String),
                endValue = jasmine.any(String),
                mockObj = jasmine.any(Object);

            filterFnStart.and.returnValue(true);
            filterFnEnd.and.returnValue(true);

            var filter = gridTableUtil.doubleFilterFactory(postResetCallback, filterFnStart, filterFnEnd);

            filter.start.value = startValue;
            filter.end.value = endValue;

            var startResult = filter.start.filterFn(mockObj);
            var endResult = filter.end.filterFn(mockObj);

            expect(startResult).toBeTruthy();
            expect(endResult).toBeTruthy();
        });

        it('should not format values', function() {
            var startValue = jasmine.any(String),
                endValue = jasmine.any(String);

            var filter = gridTableUtil.doubleFilterFactory(postResetCallback, filterFnStart, filterFnEnd);

            filter.start.value = startValue;
            filter.end.value = endValue;

            expect(filter.start.formattedValue()).toBe(startValue);
            expect(filter.end.formattedValue()).toBe(endValue);
        });

        it('should not format values', function() {
            var startValue = 'a',
                endValue = 'b',
                formatter = function(str) { return str.toUpperCase(); };

            var filter = gridTableUtil.doubleFilterFactory(postResetCallback, filterFnStart, filterFnEnd, formatter);

            filter.start.value = startValue;
            filter.end.value = endValue;

            expect(filter.start.formattedValue()).toBe('A');
            expect(filter.end.formattedValue()).toBe('B');
        });
    });

    describe('textFilterTemplateFactory', function() {
        var placeholder = jasmine.any(String),
            filter = jasmine.any(String),
            filterFn = jasmine.any(String);

        it('should return a well formed text filter template', function() {
            var result = gridTableUtil.textFilterTemplateFactory(placeholder, filter, filterFn);
            expect(result).toBe('<div class="ui-grid-filter-container text-left" ng-repeat="colFilter in col.filters"> <i class="fa fa-filter" ns-popover ns-popover-timeout="-1" ns-popover-template=\'<div class="ns-popover-tooltip"><div class="triangle"></div><ul><li><div class="row"><input class="col-md-offset-1 col-md-8" type="text" placeholder="' + placeholder + '" data-ng-model="col.grid.appScope.' + filter + '.value" data-ng-change="col.grid.appScope.' + filterFn + '" /> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.' + filter + '.reset()" > <i class="ui-grid-icon-cancel"></i> </button></div></li></ul></div>\' ns-popover-trigger="click" ns-popover-placement="top|left" ns-popover-plain="true"></i> <span class="header-filtered">{{ col.grid.appScope.' + filter + '.value }}</span> </div>');
        });
    });

    describe('dateFilterTemplateFactory', function() {
        var filter = jasmine.any(String);

        it('should return a well formed date filter template', function() {
            var result = gridTableUtil.dateFilterTemplateFactory(filter);
            expect(result).toBe('<div class="ui-grid-filter-container text-left" ng-repeat="colFilter in col.filters"> <div class="row"> <span class="col-md-1"><i class="fa fa-filter" ns-popover ns-popover-timeout="-1" ns-popover-template=\'<div class="ns-popover-tooltip"><div class="triangle"></div><ul><li><div class="row"><input date-range-picker placeholder="greater than ..." class="date-picker col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.' + filter + '.start.value" max="col.grid.appScope.' + filter + '.end.value" options="col.grid.appScope.' + filter + '.options" /> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.' + filter + '.start.reset()" > <i class="ui-grid-icon-cancel"></i> </button> </div> <div class="row"> <input date-range-picker placeholder="less than ..." class="date-picker col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.' + filter + '.end.value" min="col.grid.appScope.' + filter + '.start.value" options="col.grid.appScope.' + filter + '.options"/> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.' + filter + '.end.reset()" > <i class="ui-grid-icon-cancel"></i> </button></div></li></ul></div>\' ns-popover-trigger="click" ns-popover-placement="top|left" ns-popover-plain="true" ></i></span> <span class="header-filtered col-md-8">{{ col.grid.appScope.' + filter + '.start.formattedValue() }}</span></div> <div class="row"><span class="header-filtered col-md-offset-2 col-md-8">{{ col.grid.appScope.' + filter + '.end.formattedValue() }}</span></div> </div>');
        });
    });

    describe('doubleNumberFilterTemplateFactory', function() {
        var filter = jasmine.any(String),
            filterFn = jasmine.any(String);

        it('should return a well formed double number filter template', function() {
            var result = gridTableUtil.doubleNumberFilterTemplateFactory(filter, filterFn);
            expect(result).toBe('<div class="ui-grid-filter-container text-left" ng-repeat="colFilter in col.filters"> <div class="row"> <span class="col-md-1"><i class="fa fa-filter" ns-popover ns-popover-timeout="-1" ns-popover-template=\'<div class="ns-popover-tooltip"><div class="triangle"></div><ul><li><div class="row"><input placeholder="greater than ..." class="col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.' + filter + '.start.value" data-ng-change="col.grid.appScope.' + filterFn + '"/> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.' + filter + '.start.reset()" > <i class="ui-grid-icon-cancel"></i> </button> </div> <div class="row"> <input placeholder="less than ..." class="col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.' + filter + '.end.value" data-ng-change="col.grid.appScope.' + filterFn + '" /> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.' + filter + '.end.reset()" >  <i class="ui-grid-icon-cancel"></i> </button></div></li></ul></div>\' ns-popover-trigger="click" ns-popover-placement="top|left" ns-popover-plain="true"  ></i> </span> <span class="header-filtered col-md-8">{{ col.grid.appScope.' + filter + '.start.formattedValue() }}</span></div> <div class="row"><span class="header-filtered col-md-offset-2 col-md-8">{{ col.grid.appScope.' + filter + '.end.formattedValue() }}</span></div> </div>');
        });
    });

    describe('doublePercentFilterTemplateFactory', function() {
        var filter = jasmine.any(String),
            filterFn = jasmine.any(String);

        it('should return a well formed double percent filter template', function() {
            var result = gridTableUtil.doublePercentFilterTemplateFactory(filter, filterFn);
            expect(result).toBe('<div class="ui-grid-filter-container text-left" ng-repeat="colFilter in col.filters"> <div class="row"> <span class="col-md-1"><i class="fa fa-filter" ns-popover ns-popover-timeout="-1" ns-popover-template=\'<div class="ns-popover-tooltip"><div class="triangle"></div><ul><li><div class="row"><input placeholder="greater than (%)" class="col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.' + filter + '.start.value" data-ng-change="col.grid.appScope.' + filterFn + '"/> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.' + filter + '.start.reset()" > <i class="ui-grid-icon-cancel"></i> </button> </div> <div class="row"> <input placeholder="less than (%)" class="col-md-offset-1 col-md-8" type="text" data-ng-model="col.grid.appScope.' + filter + '.end.value" data-ng-change="col.grid.appScope.' + filterFn + '" /> <button type="button" class="btn btn-primary btn-xs col-md-2" data-ng-click="col.grid.appScope.' + filter + '.end.reset()" >  <i class="ui-grid-icon-cancel"></i> </button></div></li></ul></div>\' ns-popover-trigger="click" ns-popover-placement="top|left" ns-popover-plain="true"  ></i> </span> <span class="header-filtered col-md-8">{{ col.grid.appScope.' + filter + '.start.formattedValue() }}</span></div> <div class="row"><span class="header-filtered col-md-offset-2 col-md-8">{{ col.grid.appScope.' + filter + '.end.formattedValue() }}</span></div> </div>');
        });
    });

    describe('idFilterFactory', function() {
        it('should return true (string)', function() {
            var postResetCallback = jasmine.createSpy('postResetCallback'),
                filter = 'id',
                mockObj = { id: '240' };

            var idFilter = gridTableUtil.idFilterFactory(postResetCallback, filter);
            idFilter.value = '2';

            expect(idFilter.filterFn(mockObj)).toBeTruthy();
            expect(postResetCallback).not.toHaveBeenCalled();
        });

        it('should return true (int)', function() {
            var postResetCallback = jasmine.createSpy('postResetCallback'),
                filter = 'id',
                mockObj = { id: 240 };

            var idFilter = gridTableUtil.idFilterFactory(postResetCallback, filter);
            idFilter.value = 2;

            expect(idFilter.filterFn(mockObj)).toBeTruthy();
            expect(postResetCallback).not.toHaveBeenCalled();
        });

        it('should return false (string)', function() {
            var postResetCallback = jasmine.createSpy('postResetCallback'),
                filter = 'id',
                mockObj = { id: '240' };

            var idFilter = gridTableUtil.idFilterFactory(postResetCallback, filter);
            idFilter.value = '4';

            expect(idFilter.filterFn(mockObj)).toBeFalsy();
            expect(postResetCallback).not.toHaveBeenCalled();
        });

        it('should return false (int)', function() {
            var postResetCallback = jasmine.createSpy('postResetCallback'),
                filter = 'id',
                mockObj = { id: 240 };

            var idFilter = gridTableUtil.idFilterFactory(postResetCallback, filter);
            idFilter.value = 4;

            expect(idFilter.filterFn(mockObj)).toBeFalsy();
            expect(postResetCallback).not.toHaveBeenCalled();
        });

        it('should return false when empty', function() {
            var postResetCallback = jasmine.createSpy('postResetCallback'),
                filter = 'id',
                mockObj = { id: 240 };

            var idFilter = gridTableUtil.idFilterFactory(postResetCallback, filter);

            expect(idFilter.value).toBe('');
            expect(idFilter.filterFn(mockObj)).toBeTruthy();
            expect(postResetCallback).not.toHaveBeenCalled();
        });

        it('should return true when attribute not found', function() {
            var postResetCallback = jasmine.createSpy('postResetCallback'),
                filter = 'mlkdfjsml',
                mockObj = { id: 240 };

            var idFilter = gridTableUtil.idFilterFactory(postResetCallback, filter);

            expect(idFilter.filterFn(mockObj)).toBeTruthy();
            expect(postResetCallback).not.toHaveBeenCalled();
        });
    });

    describe('doubleNumberFilterFactory', function() {
        it('should both return true (string)', function() {
            var postResetCallback = jasmine.createSpy('postResetCallback'),
                filter = 'id',
                mockObj = { id: '5' };

            var doubleNumberFilter = gridTableUtil.doubleNumberFilterFactory(postResetCallback, filter);
            doubleNumberFilter.start.value = '4';
            doubleNumberFilter.end.value = '6';

            expect(doubleNumberFilter.start.filterFn(mockObj)).toBeTruthy();
            expect(doubleNumberFilter.end.filterFn(mockObj)).toBeTruthy();
        });

        it('should both return true (int)', function() {
            var postResetCallback = jasmine.createSpy('postResetCallback'),
                filter = 'id',
                mockObj = { id: 5 };

            var doubleNumberFilter = gridTableUtil.doubleNumberFilterFactory(postResetCallback, filter);
            doubleNumberFilter.start.value = 4;
            doubleNumberFilter.end.value = 6;

            expect(doubleNumberFilter.start.filterFn(mockObj)).toBeTruthy();
            expect(doubleNumberFilter.end.filterFn(mockObj)).toBeTruthy();
        });

        it('should return false (string)', function() {
            var postResetCallback = jasmine.createSpy('postResetCallback'),
                filter = 'id',
                mockObj = { id: '5' };

            var doubleNumberFilter = gridTableUtil.doubleNumberFilterFactory(postResetCallback, filter);
            doubleNumberFilter.start.value = '6';
            doubleNumberFilter.end.value = '4';

            expect(doubleNumberFilter.start.filterFn(mockObj)).toBeFalsy();
            expect(doubleNumberFilter.end.filterFn(mockObj)).toBeFalsy();
        });

        it('should both return false (int)', function() {
            var postResetCallback = jasmine.createSpy('postResetCallback'),
                filter = 'id',
                mockObj = { id: 5 };

            var doubleNumberFilter = gridTableUtil.doubleNumberFilterFactory(postResetCallback, filter);
            doubleNumberFilter.start.value = 6;
            doubleNumberFilter.end.value = 4;

            expect(doubleNumberFilter.start.filterFn(mockObj)).toBeFalsy();
            expect(doubleNumberFilter.end.filterFn(mockObj)).toBeFalsy();
        });

        it('should return false on start and true on end', function() {
            var postResetCallback = jasmine.createSpy('postResetCallback'),
                filter = 'id',
                mockObj = { id: 5 };

            var doubleNumberFilter = gridTableUtil.doubleNumberFilterFactory(postResetCallback, filter);
            doubleNumberFilter.start.value = 6;
            doubleNumberFilter.end.value = 6;

            expect(doubleNumberFilter.start.filterFn(mockObj)).toBeFalsy();
            expect(doubleNumberFilter.end.filterFn(mockObj)).toBeTruthy();
        });

        it('should return true on start and false on end', function() {
            var postResetCallback = jasmine.createSpy('postResetCallback'),
                filter = 'id',
                mockObj = { id: 5 };

            var doubleNumberFilter = gridTableUtil.doubleNumberFilterFactory(postResetCallback, filter);
            doubleNumberFilter.start.value = 4;
            doubleNumberFilter.end.value = 4;

            expect(doubleNumberFilter.start.filterFn(mockObj)).toBeTruthy();
            expect(doubleNumberFilter.end.filterFn(mockObj)).toBeFalsy();
        });

        it('should return true when attribute not found', function() {
            var postResetCallback = jasmine.createSpy('postResetCallback'),
                filter = 'sdfsd',
                mockObj = { id: 5 };

            var doubleNumberFilter = gridTableUtil.doubleNumberFilterFactory(postResetCallback, filter);
            doubleNumberFilter.start.value = 4;
            doubleNumberFilter.end.value = 4;

            expect(doubleNumberFilter.start.filterFn(mockObj)).toBeTruthy();
            expect(doubleNumberFilter.end.filterFn(mockObj)).toBeTruthy();
        });
    });

    describe('doublePercentFilterFactory', function() {
        var postResetCallback,
            filter,
            mockObj;

        beforeEach(function() {
            postResetCallback = jasmine.createSpy('postResetCallback');
            filter = 'id';
            mockObj = { id: 5 };
        });

        it('should both return true (string)', function() {
            mockObj = { id: '5' };

            var doubleNumberFilter = gridTableUtil.doublePercentFilterFactory(postResetCallback, filter);
            doubleNumberFilter.start.value = '4';
            doubleNumberFilter.end.value = '6';

            expect(doubleNumberFilter.start.filterFn(mockObj)).toBeTruthy();
            expect(doubleNumberFilter.end.filterFn(mockObj)).toBeTruthy();
        });

        it('should both return true (int)', function() {
            var doubleNumberFilter = gridTableUtil.doublePercentFilterFactory(postResetCallback, filter);
            doubleNumberFilter.start.value = 4;
            doubleNumberFilter.end.value = 6;

            expect(doubleNumberFilter.start.filterFn(mockObj)).toBeTruthy();
            expect(doubleNumberFilter.end.filterFn(mockObj)).toBeTruthy();
        });

        it('should return false (string)', function() {
            mockObj = { id: '5' };

            var doubleNumberFilter = gridTableUtil.doublePercentFilterFactory(postResetCallback, filter);
            doubleNumberFilter.start.value = '6';
            doubleNumberFilter.end.value = '4';

            expect(doubleNumberFilter.start.filterFn(mockObj)).toBeFalsy();
            expect(doubleNumberFilter.end.filterFn(mockObj)).toBeFalsy();
        });

        it('should both return false (int)', function() {
            var doubleNumberFilter = gridTableUtil.doublePercentFilterFactory(postResetCallback, filter);
            doubleNumberFilter.start.value = 6;
            doubleNumberFilter.end.value = 4;

            expect(doubleNumberFilter.start.filterFn(mockObj)).toBeFalsy();
            expect(doubleNumberFilter.end.filterFn(mockObj)).toBeFalsy();
        });

        it('should return false on start and true on end', function() {
            var doubleNumberFilter = gridTableUtil.doublePercentFilterFactory(postResetCallback, filter);
            doubleNumberFilter.start.value = 6;
            doubleNumberFilter.end.value = 6;

            expect(doubleNumberFilter.start.filterFn(mockObj)).toBeFalsy();
            expect(doubleNumberFilter.end.filterFn(mockObj)).toBeTruthy();
        });

        it('should return true on start and false on end', function() {
            var doubleNumberFilter = gridTableUtil.doublePercentFilterFactory(postResetCallback, filter);
            doubleNumberFilter.start.value = 4;
            doubleNumberFilter.end.value = 4;

            expect(doubleNumberFilter.start.filterFn(mockObj)).toBeTruthy();
            expect(doubleNumberFilter.end.filterFn(mockObj)).toBeFalsy();
        });

        it('should return true when attribute not found', function() {
            filter = 'sdfsd';

            var doubleNumberFilter = gridTableUtil.doublePercentFilterFactory(postResetCallback, filter);
            doubleNumberFilter.start.value = 4;
            doubleNumberFilter.end.value = 4;

            expect(doubleNumberFilter.start.filterFn(mockObj)).toBeTruthy();
            expect(doubleNumberFilter.end.filterFn(mockObj)).toBeTruthy();
        });
    });

    describe('textFilterFactory', function() {
        var postResetCallback,
            filter,
            mockObj;

        beforeEach(function() {
            postResetCallback = jasmine.createSpy('postResetCallback');
            filter = 'list';
            mockObj = { list: 'the moon' };
        });

        it('should return true with good assertion in first position on three', function() {
            var textFilter = gridTableUtil.textFilterFactory(postResetCallback, filter);
            textFilter.value = 'the moon, the earth, mars';

            expect(textFilter.filterFn(mockObj)).toBeTruthy();
        });

        it('should return true with good assertion in second position on three', function() {
            var textFilter = gridTableUtil.textFilterFactory(postResetCallback, filter);
            textFilter.value = 'the earth, the moon, mars';

            expect(textFilter.filterFn(mockObj)).toBeTruthy();
        });

        it('should return true with good assertion in third position on three', function() {
            var textFilter = gridTableUtil.textFilterFactory(postResetCallback, filter);
            textFilter.value = 'the earth, mars, the moon';

            expect(textFilter.filterFn(mockObj)).toBeTruthy();
        });

        it('should return true with one good assertion on one', function() {
            var textFilter = gridTableUtil.textFilterFactory(postResetCallback, filter);
            textFilter.value = 'the moon';

            expect(textFilter.filterFn(mockObj)).toBeTruthy();
        });

        it('should return true with two good assertion on two', function() {
            var textFilter = gridTableUtil.textFilterFactory(postResetCallback, filter);
            textFilter.value = 'the moon, the moon';

            expect(textFilter.filterFn(mockObj)).toBeTruthy();
        });

        it('should return false with no good assertion', function() {
            var textFilter = gridTableUtil.textFilterFactory(postResetCallback, filter);
            textFilter.value = 'the earth, mars';

            expect(textFilter.filterFn(mockObj)).toBeFalsy();
        });

        it('should return true with no assertion at all', function() {
            var textFilter = gridTableUtil.textFilterFactory(postResetCallback, filter);
            textFilter.value = '';

            expect(textFilter.filterFn(mockObj)).toBeTruthy();
        });

        it('should return true when attribute not found', function() {
            filter = 'fldksjfl';

            var textFilter = gridTableUtil.textFilterFactory(postResetCallback, filter);

            expect(textFilter.filterFn(mockObj)).toBeTruthy();
        });
    });

    describe('wordFilterFactory', function() {
        var postResetCallback,
            filter,
            mockObj;

        beforeEach(function() {
            postResetCallback = jasmine.createSpy('postResetCallback');
            filter = 'list';
            mockObj = { list: 'abc' };
        });

        it('should return true with good assertion in first position on three', function() {
            var textFilter = gridTableUtil.wordFilterFactory(postResetCallback, filter);
            textFilter.value = 'abc, def, ghi';

            expect(textFilter.filterFn(mockObj)).toBeTruthy();
        });

        it('should return true with good assertion in second position on three', function() {
            var textFilter = gridTableUtil.wordFilterFactory(postResetCallback, filter);
            textFilter.value = 'def, abc, ghi';

            expect(textFilter.filterFn(mockObj)).toBeTruthy();
        });

        it('should return true with good assertion in third position on three', function() {
            var textFilter = gridTableUtil.wordFilterFactory(postResetCallback, filter);
            textFilter.value = 'def, ghi, abc';

            expect(textFilter.filterFn(mockObj)).toBeTruthy();
        });

        it('should return true with one good assertion on one', function() {
            var textFilter = gridTableUtil.wordFilterFactory(postResetCallback, filter);
            textFilter.value = 'abc';

            expect(textFilter.filterFn(mockObj)).toBeTruthy();
        });

        it('should return true with two good assertion on two', function() {
            var textFilter = gridTableUtil.wordFilterFactory(postResetCallback, filter);
            textFilter.value = 'abc, abc';

            expect(textFilter.filterFn(mockObj)).toBeTruthy();
        });

        it('should return false with no good assertion', function() {
            var textFilter = gridTableUtil.wordFilterFactory(postResetCallback, filter);
            textFilter.value = 'def, ghi';

            expect(textFilter.filterFn(mockObj)).toBeFalsy();
        });

        it('should return true with no assertion at all', function() {
            var textFilter = gridTableUtil.wordFilterFactory(postResetCallback, filter);
            textFilter.value = '';

            expect(textFilter.filterFn(mockObj)).toBeTruthy();
        });

        it('should return true when attribute not found', function() {
            filter = 'fldksjfl';

            var textFilter = gridTableUtil.wordFilterFactory(postResetCallback, filter);

            expect(textFilter.filterFn(mockObj)).toBeTruthy();
        });

        it('should return false on more than one word assertion', function() {
            var textFilter = gridTableUtil.wordFilterFactory(postResetCallback, filter);
            textFilter.value = 'abc def';

            expect(textFilter.filterFn(mockObj)).toBeFalsy();
        });
    });

    describe('listFilterFactory', function() {
        var postResetCallback,
            filter,
            mockObj;

        beforeEach(function() {
            postResetCallback = jasmine.createSpy('postResetCallback');
            filter = 'list';
            mockObj = { list: ['abc', 'def'] };
        });

        it('should return true on good assertion', function() {
            var textFilter = gridTableUtil.listFilterFactory(postResetCallback, filter);

            textFilter.value = 'ab';
            expect(textFilter.filterFn(mockObj)).toBeTruthy();

            textFilter.value = 'abc';
            expect(textFilter.filterFn(mockObj)).toBeTruthy();

            textFilter.value = 'de';
            expect(textFilter.filterFn(mockObj)).toBeTruthy();

            textFilter.value = 'def';
            expect(textFilter.filterFn(mockObj)).toBeTruthy();
        });

        it('should return false on empty array', function() {
            var textFilter = gridTableUtil.listFilterFactory(postResetCallback, filter);
            mockObj = { list: [] };

            textFilter.value = 'abc';
            expect(textFilter.filterFn(mockObj)).toBeFalsy();
        });

        it('should return false on bad assertion', function() {
            var textFilter = gridTableUtil.listFilterFactory(postResetCallback, filter);
            mockObj = { list: ['abc', 'def'] };

            textFilter.value = 'ghi';
            expect(textFilter.filterFn(mockObj)).toBeFalsy();
        });
    });
});