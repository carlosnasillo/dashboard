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
* Created on 02/11/2015
*/

(function () {
    'use strict';

    angular
        .module('app')
        .controller('PortfolioController', PortfolioController);

    PortfolioController.$inject = ['PortfolioAnalyticsService', 'chartUtilsService'];

    function PortfolioController(PortfolioAnalyticsService, chartUtilsService) {
        var vm = this;

        vm.tab = 3;
        vm.changeTab = function(tabId) {
            vm.tab = tabId;
        };

        vm.chartOptions = chartUtilsService.doughnutChartOptions;

        vm.lendingClubPortfolioAnalytics = {};
        vm.prosperPortfolioAnalytics = {};
        vm.mergedAnalytics = {};

        PortfolioAnalyticsService.lcCurrentBalance().then(function(balance) {
           vm.lendingClubPortfolioAnalytics.currentBalance = balance;
        });

        PortfolioAnalyticsService.prosperCurrentBalance().then(function(balance) {
            vm.prosperPortfolioAnalytics.currentBalance = balance;
        });

        PortfolioAnalyticsService.totalCurrentBalance().then(function(balance) {
            vm.mergedAnalytics.currentBalance = balance;
        });

        PortfolioAnalyticsService.LCPortfolioAnalytics().then(function(analytics) {
            vm.lendingClubPortfolioAnalytics.principalOutstanding = analytics.principalOutstanding;
            vm.lendingClubPortfolioAnalytics.pendingInvestment = analytics.pendingInvestment;
            vm.lendingClubPortfolioAnalytics.currentNotes = analytics.currentNotes;
            vm.lendingClubPortfolioAnalytics.principalReceived = analytics.principalReceived;
            vm.lendingClubPortfolioAnalytics.interestReceived = analytics.interestReceived;
            vm.lendingClubPortfolioAnalytics.principalOutstandingByGrade = chartUtilsService.fromMapToC3StyleData(analytics.principalOutstandingByGrade);
            vm.lendingClubPortfolioAnalytics.principalOutstandingByTerm = chartUtilsService.fromMapToC3StyleData(analytics.principalOutstandingByTerm);

            vm.lendingClubPortfolioAnalytics.notesByGrade = chartUtilsService.fromMapToC3StyleData(analytics.notesByGrade);
            vm.lendingClubPortfolioAnalytics.notesByState = chartUtilsService.fromMapToC3StyleData(analytics.notesByState);

            vm.lendingClubPortfolioAnalytics.principalOutstandingByYield = chartUtilsService.fromMapToC3StyleData(chartUtilsService.doubleDoubleToPercents(analytics.principalOutstandingByYield));

            var principalOutstandingByStateByGradeInverted = chartUtilsService.moveGradeFromValueToKey(analytics.principalOutstandingByStateByGrade);
            var principalOutstandingByStateByGradeWithArray = chartUtilsService.secondDimensionObjToArray(principalOutstandingByStateByGradeInverted);
            vm.lendingClubPortfolioAnalytics.principalOutstandingByStateByGrade = {};
            vm.lendingClubPortfolioAnalytics.principalOutstandingByStateByGrade.data = $.map(principalOutstandingByStateByGradeWithArray, function(v, i) {
                return [[i].concat(v)];
            });
            vm.lendingClubPortfolioAnalytics.principalOutstandingByStateByGrade.categories = Object.keys(analytics.principalOutstandingByStateByGrade);
            vm.lendingClubPortfolioAnalytics.principalOutstandingByStateByGrade.groups = [ vm.lendingClubPortfolioAnalytics.principalOutstandingByStateByGrade.data.map(function(v) { return v[0]; }) ];

            var notesByStateByGradeInverted = chartUtilsService.moveGradeFromValueToKey(analytics.notesByStateByGrade);
            var notesByStateByGradeWithArray = chartUtilsService.secondDimensionObjToArray(notesByStateByGradeInverted);
            vm.lendingClubPortfolioAnalytics.notesByStateByGrade = {};
            vm.lendingClubPortfolioAnalytics.notesByStateByGrade.data = $.map(notesByStateByGradeWithArray, function(v, i) {
                return [[i].concat(v)];
            });
            vm.lendingClubPortfolioAnalytics.notesByStateByGrade.categories = Object.keys(analytics.notesByStateByGrade);
            vm.lendingClubPortfolioAnalytics.notesByStateByGrade.groups = [ vm.lendingClubPortfolioAnalytics.notesByStateByGrade.data.map(function(v) { return v[0]; }) ];
        });

        PortfolioAnalyticsService.prosperPortfolioAnalytics().then(function(analytics) {
            vm.prosperPortfolioAnalytics.principalOutstanding = analytics.principalOutstanding;
            vm.prosperPortfolioAnalytics.pendingInvestment = analytics.pendingInvestment;
            vm.prosperPortfolioAnalytics.currentNotes = analytics.currentNotes;
            vm.prosperPortfolioAnalytics.principalReceived = analytics.principalReceived;
            vm.prosperPortfolioAnalytics.interestReceived = analytics.interestReceived;
            vm.prosperPortfolioAnalytics.principalOutstandingByGrade = chartUtilsService.fromMapToC3StyleData(analytics.principalOutstandingByGrade);
            vm.prosperPortfolioAnalytics.principalOutstandingByTerm = chartUtilsService.fromMapToC3StyleData(analytics.principalOutstandingByTerm);

            vm.prosperPortfolioAnalytics.notesByGrade = chartUtilsService.fromMapToC3StyleData(analytics.notesByGrade);
            vm.prosperPortfolioAnalytics.notesByState = chartUtilsService.fromMapToC3StyleData(analytics.notesByState);

            vm.prosperPortfolioAnalytics.principalOutstandingByYield = chartUtilsService.fromMapToC3StyleData(chartUtilsService.doubleDoubleToPercents(analytics.principalOutstandingByYield));

            vm.prosperPortfolioAnalytics.principalOutstandingByStateByGrade = chartUtilsService.moveGradeFromValueToKey(analytics.principalOutstandingByStateByGrade);
            vm.prosperPortfolioAnalytics.notesByStateByGrade = chartUtilsService.moveGradeFromValueToKey(analytics.notesByStateByGrade);

            var principalOutstandingByStateByGradeInverted = chartUtilsService.moveGradeFromValueToKey(analytics.principalOutstandingByStateByGrade);
            var principalOutstandingByStateByGradeWithArray = chartUtilsService.secondDimensionObjToArray(principalOutstandingByStateByGradeInverted);
            vm.prosperPortfolioAnalytics.principalOutstandingByStateByGrade = {};
            vm.prosperPortfolioAnalytics.principalOutstandingByStateByGrade.data = $.map(principalOutstandingByStateByGradeWithArray, function(v, i) {
                return [[i].concat(v)];
            });
            vm.prosperPortfolioAnalytics.principalOutstandingByStateByGrade.categories = Object.keys(analytics.principalOutstandingByStateByGrade);
            vm.prosperPortfolioAnalytics.principalOutstandingByStateByGrade.groups = [ vm.prosperPortfolioAnalytics.principalOutstandingByStateByGrade.data.map(function(v) { return v[0]; }) ];

            var notesByStateByGradeInverted = chartUtilsService.moveGradeFromValueToKey(analytics.notesByStateByGrade);
            var notesByStateByGradeWithArray = chartUtilsService.secondDimensionObjToArray(notesByStateByGradeInverted);
            vm.prosperPortfolioAnalytics.notesByStateByGrade = {};
            vm.prosperPortfolioAnalytics.notesByStateByGrade.data = $.map(notesByStateByGradeWithArray, function(v, i) {
                return [[i].concat(v)];
            });
            vm.prosperPortfolioAnalytics.notesByStateByGrade.categories = Object.keys(analytics.notesByStateByGrade);
            vm.prosperPortfolioAnalytics.notesByStateByGrade.groups = [ vm.prosperPortfolioAnalytics.notesByStateByGrade.data.map(function(v) { return v[0]; }) ];
        });

        PortfolioAnalyticsService.allPortfolioAnalytics().then(function(analytics) {
            vm.mergedAnalytics.principalOutstanding = 0;
            vm.mergedAnalytics.pendingInvestment = 0;
            vm.mergedAnalytics.currentNotes = 0;
            vm.mergedAnalytics.principalReceived = 0;
            vm.mergedAnalytics.interestReceived = 0;

            var notesByGrade = {};
            var notesByState = {};

            var notesByMarkets = [];
            var notesAmountByMarket = [];

            var notesByStateByGrade = {
                data: []
            };

            var principalOutstandingByStateByGrade = {
                data: []
            };

            $.map(analytics, function(v, i) {
                vm.mergedAnalytics.principalOutstanding += v.principalOutstanding;
                vm.mergedAnalytics.pendingInvestment += v.pendingInvestment;
                vm.mergedAnalytics.currentNotes += v.currentNotes;
                vm.mergedAnalytics.principalReceived += v.principalReceived;
                vm.mergedAnalytics.interestReceived += v.interestReceived;

                notesByGrade = chartUtilsService.mergeObjects(v.notesByGrade, notesByGrade);
                notesByState = chartUtilsService.mergeObjects(v.notesByState, notesByState);

                notesByMarkets.push([chartUtilsService.fromCamelCaseToTitleCase(i), v.currentNotes]);
                notesAmountByMarket.push([chartUtilsService.fromCamelCaseToTitleCase(i), v.principalOutstanding]);

                var notesByStateByGradeInverted = chartUtilsService.moveGradeFromValueToKey(v.notesByStateByGrade);
                var notesByStateByGradeWithArray = chartUtilsService.secondDimensionObjToArray(notesByStateByGradeInverted);
                var notesByStateByGradeC3Style = chartUtilsService.bindFirstAndSecondDimensions(notesByStateByGradeWithArray);
                var notesByStateByGradePrefixed = chartUtilsService.prefixColumnsName(i, notesByStateByGradeC3Style);
                notesByStateByGrade.data = notesByStateByGrade.data.concat(notesByStateByGradePrefixed);
                notesByStateByGrade.categories = Object.keys(v.notesByStateByGrade);

                var principalOutstandingByStateByGradeInverted = chartUtilsService.moveGradeFromValueToKey(v.principalOutstandingByStateByGrade);
                var principalOutstandingByStateByGradeWithArray = chartUtilsService.secondDimensionObjToArray(principalOutstandingByStateByGradeInverted);
                var principalOutstandingByStateByGradeC3Style = chartUtilsService.bindFirstAndSecondDimensions(principalOutstandingByStateByGradeWithArray);
                var principalOutstandingByStateByGradePrefixed = chartUtilsService.prefixColumnsName(i, principalOutstandingByStateByGradeC3Style);
                principalOutstandingByStateByGrade.data = principalOutstandingByStateByGrade.data.concat(principalOutstandingByStateByGradePrefixed);
                principalOutstandingByStateByGrade.categories = Object.keys(v.principalOutstandingByStateByGrade);
            });

            vm.mergedAnalytics.notesByGrade = chartUtilsService.fromMapToC3StyleData(notesByGrade);
            vm.mergedAnalytics.notesByState = chartUtilsService.fromMapToC3StyleData(notesByState);

            vm.mergedAnalytics.notesByMarkets = notesByMarkets;
            vm.mergedAnalytics.notesAmountByMarket = notesAmountByMarket;

            notesByStateByGrade.groups = chartUtilsService.getColumnsByPrefix(
                notesByStateByGrade.data.map(function(v) { return v[0]; }),
                Object.keys(analytics)
            );
            notesByStateByGrade.colors = chartUtilsService.getColorsBySuffix(
                notesByStateByGrade.data.map(function(v) { return v[0]; }),
                Object.keys(analytics)
            );
            notesByStateByGrade.names = {};
            Object.keys(notesByStateByGrade.colors).map(function(colName) {
                notesByStateByGrade.names[colName] = chartUtilsService.getSuffix(colName);
            });
            var firstOriginator = Object.keys(notesByStateByGrade.colors)[0].split('-')[0];
            notesByStateByGrade.hide = Object.keys(notesByStateByGrade.colors).filter(function(colName) {
                return colName.indexOf(firstOriginator) < 0;
            });

            vm.mergedAnalytics.notesByStateByGrade = notesByStateByGrade;

            principalOutstandingByStateByGrade.groups = chartUtilsService.getColumnsByPrefix(
                principalOutstandingByStateByGrade.data.map(function(v) { return v[0]; }),
                Object.keys(analytics)
            );
            principalOutstandingByStateByGrade.colors = chartUtilsService.getColorsBySuffix(
                principalOutstandingByStateByGrade.data.map(function(v) { return v[0]; }),
                Object.keys(analytics)
            );
            principalOutstandingByStateByGrade.names = {};
            Object.keys(principalOutstandingByStateByGrade.colors).map(function(colName) {
                principalOutstandingByStateByGrade.names[colName] = chartUtilsService.getSuffix(colName);
            });
            firstOriginator = Object.keys(principalOutstandingByStateByGrade.colors)[0].split('-')[0];
            principalOutstandingByStateByGrade.hide = Object.keys(principalOutstandingByStateByGrade.colors).filter(function(colName) {
                return colName.indexOf(firstOriginator) < 0;
            });

            vm.mergedAnalytics.principalOutstandingByStateByGrade = principalOutstandingByStateByGrade;
        });
    }
})();