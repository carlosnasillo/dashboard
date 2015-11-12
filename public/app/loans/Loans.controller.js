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

    LoansController.$inject = ['LoansService', 'uiGridConstants', '$modal'];

    function LoansController(LoansService, uiGridConstants, $modal) {
        var vm = this;

        vm.loansTable = { options: {} };

        LoansService.loansAvailable().success(function(data) {
            vm.loansTable.options.data = data.loans.map(function(data) {
                data.foundedPie = [data.fundedAmount, data.loanAmount];
                data.fundedAmountPerCenter = (data.fundedAmount / data.loanAmount) * 100;
                return data;
            });
        });

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
                    type: 'date'
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
                    },
                    type: 'text'
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
                    field: 'purpose',
                    headerCellClass: vm.highlightFilteredHeader,
                    type: 'text',
                    enableFiltering: false
                },
                {
                    field: 'id',
                    displayName: 'Order',
                    cellTemplate: "<div class='text-center'><span class='label label-primary' data-ng-click='row.grid.appScope.vm.order(row.entity.id, row.entity.loanAmount, row.entity.fundedAmount)'>Add to Order</span></div>",
                    // TODO : disable the button when the loan is 100% funded
                    enableFiltering: false
                }
            ]
        };

        vm.order = function(loanId, loanAmount, fundedAmount) {
            var modalInstance = $modal.open({
                templateUrl: 'view/modal-order',
                controller: OrderModalInstanceCtrl,
                resolve: {
                    loanId: function() { return loanId; },
                    loanAmount: function() { return loanAmount; },
                    fundedAmount: function() { return fundedAmount; }
                }
            });
        };

        function OrderModalInstanceCtrl($scope, $modalInstance, loanId, loanAmount, fundedAmount, SweetAlert, LoansService) {
            $scope.loanId = loanId;
            $scope.loanAmount = loanAmount;
            $scope.fundedAmount = fundedAmount;

            $scope.slider = {
                min: 0,
                max: loanAmount - fundedAmount,
                step: 0.01,
                value: 0
            };

            $scope.loading = false;

            $scope.disabled = function() {
                return $scope.slider.value > $scope.slider.max;
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
        }
    }
})();