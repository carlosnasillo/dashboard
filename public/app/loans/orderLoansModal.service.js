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
* Created on 20/11/2015
*/

(function() {
    'use strict';

    angular
        .module('app')
        .factory('OrderLoansModalService', OrderLoansModalService);

    OrderLoansModalService.$inject = ['$uibModal', 'FormUtilsService'];

    function OrderLoansModalService($uibModal, FormUtilsService) {

        return {
           orderModal: orderModal
        };

        function orderModal(loanId, loanAmount, fundedAmount, originator, investorId) {
            var modalInstance = $uibModal.open({
                templateUrl: 'assets/app/modals/my-order-modal.html',
                controller: OrderModalInstanceCtrl,
                resolve: {
                    loanId: function() { return loanId; },
                    loanAmount: function() { return loanAmount; },
                    fundedAmount: function() { return fundedAmount; },
                    originator: function() { return originator; },
                    investorId: function() { return investorId; }
                }
            });
        }

        function OrderModalInstanceCtrl($scope, $modalInstance, loanId, loanAmount, fundedAmount, originator, SweetAlert, LoansService, minInvestByOriginator, investorId, FormUtilsService) {
            $scope.loanId = loanId;
            $scope.loanAmount = loanAmount;
            $scope.fundedAmount = fundedAmount;
            $scope.originator = originator;
            $scope.investorId = investorId;

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
                    return !FormUtilsService.isNumeric($scope.slider.value);
                }
            };

            $scope.disabled = function() {
                return $scope.conditions.valueGtRemaining() ||
                    $scope.conditions.valueLtMin() ||
                    $scope.conditions.notNumeric();
            };

            $scope.ok = function () {
                $scope.loading = true;
                LoansService.submitOrder($scope.investorId, loanId, $scope.slider.value).then( orderSuccess, orderError );
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

            function toCamelCase(str) {
                return str
                    .replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
                    .replace(/\s/g, '')
                    .replace(/^(.)/, function($1) { return $1.toLowerCase(); });
            }
        }
    }


})();