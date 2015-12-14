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
        .factory('RfqModalService', RfqModalService);

    RfqModalService.$inject = ['$uibModal'];

    function RfqModalService($uibModal) {

        var orderModal = function(loanId, originator) {
            var modalInstance = $uibModal.open({
                templateUrl: 'assets/app/loanbook/rfqModal.html',
                controller: OrderModalInstanceCtrl,
                resolve: {
                    loanId: function() { return loanId; },
                    originator: function() { return originator; }
                }
            });
        };

        function OrderModalInstanceCtrl($scope, $modalInstance, loanId, originator, RfqService, AuthenticationService, SweetAlert) {
            $scope.loanId = loanId;
            $scope.originator = originator;

            $scope.loading = false;

            $scope.form = {
                duration: 0,
                creditEvent: [],
                counterparty: [],
                quoteWindow: 0,
                cdsValue: 0
            };

            $scope.conditions = {
                durationNotNumeric: function() {
                    return !isNumeric($scope.form.duration);
                },
                quoteWindowNotNumeric: function() {
                    return !isNumeric($scope.form.quoteWindow);
                },
                cdsValueNotNumeric: function() {
                    return !isNumeric($scope.form.cdsValue);
                },
                creditEventNotEmpty: function() {
                    return $scope.form.creditEvent.length === 0;
                },
                counterpartyNotEmpty: function() {
                    return $scope.form.counterparty.length === 0;
                }
            };

            $scope.submitButtonDisabled = function() {
                return $scope.conditions.durationNotNumeric() ||
                    $scope.conditions.quoteWindowNotNumeric() ||
                    $scope.conditions.cdsValueNotNumeric() ||
                    $scope.conditions.creditEventNotEmpty() ||
                    $scope.conditions.counterpartyNotEmpty();
            };

            $scope.selectUtils = {
                banks: {
                    data: ["Dealer1", "Dealer2", "Dealer3"],
                    clearSelect: function() {
                        $scope.form.counterparty = [];
                    },
                    selectAll: function() {
                        $scope.form.counterparty = $scope.selectUtils.banks.data;
                    }
                },
                creditEvents: {
                    data: ["Default", "Late payment"],
                    clearSelect: function() {
                        $scope.form.creditEvent = [];
                    },
                    selectAll: function() {
                        $scope.form.creditEvent = $scope.selectUtils.creditEvents.data;
                    }
                }
            };

            $scope.ok = function () {
                $scope.loading = true;
                RfqService.submitRfq(
                    $scope.form.duration,
                    $scope.form.creditEvent,
                    $scope.form.counterparty,
                    $scope.form.quoteWindow,
                    $scope.form.cdsValue,
                    AuthenticationService.getCurrentAccount(),
                    loanId,
                    originator
                ).then( orderSuccess, orderError );
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            function isNumeric(n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            }

            function closeModal() {
                $scope.loading = false;
                $modalInstance.close();
            }

            function orderSuccess() {
                SweetAlert.swal(
                    "Done !",
                    "RFQ submitted !",
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

        return {
            orderModal: orderModal
        };
    }
})();