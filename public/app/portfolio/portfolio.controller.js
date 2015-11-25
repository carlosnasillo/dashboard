/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

/**
 * Created by julienderay on 02/11/2015.
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

        PortfolioAnalyticsService.LCPortfolioAnalytics().then(function(analytics) {
            vm.lendingClubPortfolioAnalytics = analytics;

            var splittedNoteByGrade = chartUtilsService.splitObjectInArray(vm.lendingClubPortfolioAnalytics.notesByGrade);
            vm.lendingClubPortfolioAnalytics.notesByGradeLabels = splittedNoteByGrade.labels;
            vm.lendingClubPortfolioAnalytics.notesByGradeConverted = splittedNoteByGrade.array;

            var splittedNoteByState = chartUtilsService.splitObjectInArray(vm.lendingClubPortfolioAnalytics.notesByState);
            vm.lendingClubPortfolioAnalytics.notesByStateLabels = splittedNoteByState.labels;
            vm.lendingClubPortfolioAnalytics.notesByStateConverted = splittedNoteByState.array;

            vm.lendingClubPortfolioAnalytics.principalOutstandingByYield = chartUtilsService.doubleDoubleToPercents(vm.lendingClubPortfolioAnalytics.principalOutstandingByYield);

            vm.lendingClubPortfolioAnalytics.principalOutstandingByStateByGrade = chartUtilsService.movesGradeFromValueToKey(vm.lendingClubPortfolioAnalytics.principalOutstandingByStateByGrade);
            vm.lendingClubPortfolioAnalytics.notesByStateByGrade = chartUtilsService.movesGradeFromValueToKey(vm.lendingClubPortfolioAnalytics.notesByStateByGrade);
        });

        PortfolioAnalyticsService.prosperPortfolioAnalytics().then(function(analytics) {
            vm.prosperPortfolioAnalytics = analytics;

            var splittedNoteByGrade = chartUtilsService.splitObjectInArray(vm.prosperPortfolioAnalytics.notesByGrade);
            vm.prosperPortfolioAnalytics.notesByGradeLabels = splittedNoteByGrade.labels;
            vm.prosperPortfolioAnalytics.notesByGradeConverted = splittedNoteByGrade.array;

            var splittedNoteByState = chartUtilsService.splitObjectInArray(vm.prosperPortfolioAnalytics.notesByState);
            vm.prosperPortfolioAnalytics.notesByStateLabels = splittedNoteByState.labels;
            vm.prosperPortfolioAnalytics.notesByStateConverted = splittedNoteByState.array;

            vm.prosperPortfolioAnalytics.principalOutstandingByYield = chartUtilsService.doubleDoubleToPercents(vm.prosperPortfolioAnalytics.principalOutstandingByYield);

            vm.prosperPortfolioAnalytics.principalOutstandingByStateByGrade = chartUtilsService.movesGradeFromValueToKey(vm.prosperPortfolioAnalytics.principalOutstandingByStateByGrade);
            vm.prosperPortfolioAnalytics.notesByStateByGrade = chartUtilsService.movesGradeFromValueToKey(vm.prosperPortfolioAnalytics.notesByStateByGrade);
        });

        PortfolioAnalyticsService.allPortfolioAnalytics().then(function(analytics) {
            vm.mergedAnalytics = {};

            vm.mergedAnalytics.principalOutstanding = 0;
            vm.mergedAnalytics.pendingInvestment = 0;
            vm.mergedAnalytics.currentNotes = 0;
            vm.mergedAnalytics.principalReceived = 0;
            vm.mergedAnalytics.interestReceived = 0;

            var notesByGrade = {};
            var notesByState = {};

            $.map(analytics, function(v, i) {
                vm.mergedAnalytics.principalOutstanding += v.principalOutstanding;
                vm.mergedAnalytics.pendingInvestment += v.pendingInvestment;
                vm.mergedAnalytics.currentNotes += v.currentNotes;
                vm.mergedAnalytics.principalReceived += v.principalReceived;
                vm.mergedAnalytics.interestReceived += v.interestReceived;

                notesByGrade = chartUtilsService.mergeObjects(v.notesByGrade, notesByGrade);
                notesByState = chartUtilsService.mergeObjects(v.notesByState, notesByState);
            });

            var slittedNoteByGrade = chartUtilsService.splitObjectInArray(notesByGrade);
            vm.mergedAnalytics.notesByGradeLabels = slittedNoteByGrade.labels;
            vm.mergedAnalytics.notesByGradeConverted = slittedNoteByGrade.array;

            var slittedNoteByState = chartUtilsService.splitObjectInArray(notesByState);
            vm.mergedAnalytics.notesByStateLabels = slittedNoteByState.labels;
            vm.mergedAnalytics.notesByStateConverted = slittedNoteByState.array;
        });
    }
})();