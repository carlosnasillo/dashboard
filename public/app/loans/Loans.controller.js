/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

/**
 * Created by julienderay on 09/11/2015.
 */

(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoansController', LoansController);

    LoansController.$inject = ['LoansService', 'uiGridConstants', '$uibModal'];

    function LoansController(LoansService, uiGridConstants, $uibModal) {
        var vm = this;

        vm.loansTable = { options: {} };
        vm.loansTable.purposeOptions = [];

        LoansService.loansAvailable().success(function(data) {
            var listPurpose = {};

            vm.loansTable.options.data = data.loans.map(function(data) {
                data.fundedAmountPerCenter = (data.fundedAmount / data.loanAmount) * 100;
                data.foundedPie = [data.fundedAmountPerCenter, 100 - data.fundedAmountPerCenter];

                listPurpose[data.purpose] = data.purpose;
                data.originator = "Lending Club";

                return data;
            });

            vm.loansTable.purposeOptions =
                Object
                    .keys(listPurpose)
                    .map(function(purpose) {
                        return { purpose: purpose, ticked: true };
                    });

            vm.originalData = vm.loansTable.options.data;
        });

        vm.loansTable.purposeFilterClick = function(data) {
            var selectedPurposes = vm.loansTable.purposeOptions
                .filter(function(purposeObj) {
                    return purposeObj.ticked;
                })
                .map(function(purposeObj) {
                    return purposeObj.purpose;
                });

            vm.loansTable.options.data = vm.originalData.filter(function(loanObj) {
               return selectedPurposes.indexOf( loanObj.purpose ) > -1;
            });
        };

        vm.loansTable.pieChartOptions = {
            fill: ["#00b494", "#d7d7d7"],
            width: 50
        };

        vm.highlightFilteredHeader = function( row, rowRenderIndex, col ) {
            if ( col.filters[0].term ) {
                return 'header-filtered';
            } else {
                return '';
            }
        };

        vm.loansTable.options = {
            enableColumnMenus: false,
            enableSorting: true,
            enableFiltering: true,
            columnDefs: [
                {
                    field: 'originator',
                    filter: {
                        condition: function(searchTerm, cellValue) {
                            var searchTerms = searchTerm.split(',').map(function(search) { return search.trim(); });
                            for (var i in searchTerms) {
                                if ( searchTerms.hasOwnProperty(i) ) {
                                    if (cellValue.startsWith(searchTerms[i])) return true;
                                }
                            }
                            return false;
                        },
                        placeholder: 'ex: "Prosper" or "Lending Club, Prosper"'
                    }
                },
                {
                    field: 'id',
                    displayName: 'Listing Id',
                    headerCellClass: vm.highlightFilteredHeader,
                    type: 'number'
                },
                {
                    field: 'listD',
                    displayName: 'Listed',
                    headerCellClass: vm.highlightFilteredHeader,
                    cellFilter: 'date:"dd/MM/yyyy"',
                    filterCellFiltered: true,
                    type: 'date',
                    filters: [
                        {
                            condition: uiGridConstants.filter.GREATER_THAN,
                            placeholder: 'greater than'
                        },
                        {
                            condition: uiGridConstants.filter.LESS_THAN,
                            placeholder: 'less than'
                        }
                    ]
                },
                {
                    field: 'loanAmount',
                    displayName: 'Requested',
                    filters: [
                        {
                            condition: uiGridConstants.filter.GREATER_THAN,
                            placeholder: 'greater than'
                        },
                        {
                            condition: uiGridConstants.filter.LESS_THAN,
                            placeholder: 'less than'
                        }
                    ],
                    headerCellClass: vm.highlightFilteredHeader,
                    type: 'number'
                },
                {
                    field: 'fundedAmountPerCenter',
                    displayName: 'Founded',
                    filters: [
                        {
                            condition: uiGridConstants.filter.GREATER_THAN,
                            placeholder: 'greater than (%)'
                        },
                        {
                            condition: uiGridConstants.filter.LESS_THAN,
                            placeholder: 'less than (%)'
                        }
                    ],
                    headerCellClass: vm.highlightFilteredHeader,
                    type: 'number',
                    cellTemplate: "<pie-chart data='row.entity.foundedPie' options='row.grid.appScope.vm.loansTable.pieChartOptions'></pie-chart>"
                },
                {
                    field: 'grade',
                    headerCellClass: vm.highlightFilteredHeader,
                    filter: {
                        condition: function(searchTerm, cellValue) {
                            return searchTerm.split(',').map(function(search) { return search.trim(); }).indexOf(cellValue) >= 0;
                        },
                        placeholder: 'ex: "C" or "D, A"'
                    }
                },
                {
                    field: 'term',
                    filters: [
                        {
                            condition: uiGridConstants.filter.GREATER_THAN,
                            placeholder: 'greater than'
                        },
                        {
                            condition: uiGridConstants.filter.LESS_THAN,
                            placeholder: 'less than'
                        }
                    ],
                    headerCellClass: vm.highlightFilteredHeader,
                    type: 'number'
                },
                {
                    field: 'intRate',
                    displayName: 'Yield',
                    filters: [
                        {
                            condition: uiGridConstants.filter.GREATER_THAN,
                            placeholder: 'greater than'
                        },
                        {
                            condition: uiGridConstants.filter.LESS_THAN,
                            placeholder: 'less than'
                        }
                    ],
                    headerCellClass: vm.highlightFilteredHeader,
                    cellTemplate: '<div class="ui-grid-cell-contents">{{ COL_FIELD }} %</div>',
                    type: 'number'
                },
                {
                    field: 'purpose',
                    headerCellClass: vm.highlightFilteredHeader + " bigHeader",
                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><isteven-multi-select input-model="col.grid.appScope.vm.loansTable.purposeOptions" button-label="purpose" item-label="purpose" tick-property="ticked" max-labels="1" helper-elements="" on-item-click="col.grid.appScope.vm.loansTable.purposeFilterClick(data)" default-label="None" max-height="70px" class="level-multi-select"></isteven-multi-select></div>'
                },
                {
                    field: 'id',
                    displayName: 'Order',
                    cellTemplate: "<div class='text-center'><span data-ng-if='row.entity.loanAmount > row.entity.fundedAmount' class='label label-primary' data-ng-click='row.grid.appScope.vm.order(row.entity.id, row.entity.loanAmount, row.entity.fundedAmount, row.entity.originator)'>Add to Order</span><span data-ng-if='row.entity.loanAmount === row.entity.fundedAmount' class='label label-warning' disabled='disabled'>Not available</span></div>",
                    enableFiltering: false
                }
            ]
        };

        vm.order = function(loanId, loanAmount, fundedAmount, originator) {
            var modalInstance = $uibModal.open({
                templateUrl: 'view/modal-order',
                controller: OrderModalInstanceCtrl,
                resolve: {
                    loanId: function() { return loanId; },
                    loanAmount: function() { return loanAmount; },
                    fundedAmount: function() { return fundedAmount; },
                    originator: function() { return originator; }
                }
            });
        };

        function OrderModalInstanceCtrl($scope, $modalInstance, loanId, loanAmount, fundedAmount, originator, SweetAlert, LoansService, minInvestByOriginator) {
            $scope.loanId = loanId;
            $scope.loanAmount = loanAmount;
            $scope.fundedAmount = fundedAmount;
            $scope.originator = originator;

            var originatorMinInvest = minInvestByOriginator[toCamelCase(originator)];

            $scope.slider = {
                min: originatorMinInvest,
                max: loanAmount - fundedAmount,
                step: 0.01,
                value: parseInt(originatorMinInvest) + 1
            };

            $scope.loading = false;

            $scope.conditions = {
                valueGtRemaining: function() {
                    return $scope.slider.value > $scope.slider.max;
                },
                valueLtMin: function() {
                    return $scope.slider.value <= originatorMinInvest;
                },
                notNumeric: function() {
                    return !isNumeric($scope.slider.value);
                }
            };

            $scope.disabled = function() {
                return $scope.conditions.valueGtRemaining() ||
                    $scope.conditions.valueLtMin() ||
                    $scope.conditions.notNumeric();
            };

            $scope.ok = function () {
                $scope.loading = true;
                LoansService.submitOrder('BlackRock', loanId, $scope.slider.value).then( orderSuccess, orderError );
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            function closeModal() {
                $scope.loading = false;
                $modalInstance.close();
            }

            function orderSuccess() {
                SweetAlert.swal(
                    "Done !",
                    "Your order has been placed !",
                    "success"
                );

                closeModal();
            }

            function orderError() {
                SweetAlert.swal(
                    "Oops...",
                    "Something went wrong !",
                    "error"
                );

                closeModal();
            }

            function isNumeric(n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            }

            function toCamelCase(str) {
                return str
                .replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
                .replace(/\s/g, '')
                .replace(/^(.)/, function($1) { return $1.toLowerCase(); });
            }
        }
    }
})();