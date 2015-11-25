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

        vm.tab = 1;
        vm.changeTab = function(tabId) {
            vm.tab = tabId;
        };

        PortfolioAnalyticsService.LCPortfolioAnalytics().then(function(analytics) {
            vm.chartOptions = chartUtilsService.doughnutChartOptions;

            vm.lendingClubPortfolioAnalytics = analytics;

            var slittedNoteByGrade = chartUtilsService.splitObjectInArray(vm.lendingClubPortfolioAnalytics.notesByGrade);
            vm.lendingClubPortfolioAnalytics.notesByGradeLabels = slittedNoteByGrade.labels;
            vm.lendingClubPortfolioAnalytics.notesByGradeConverted = slittedNoteByGrade.array;

            var slittedNoteByState = chartUtilsService.splitObjectInArray(vm.lendingClubPortfolioAnalytics.notesByState);
            vm.lendingClubPortfolioAnalytics.notesByStateLabels = slittedNoteByState.labels;
            vm.lendingClubPortfolioAnalytics.notesByStateConverted = slittedNoteByState.array;

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
    }
})();