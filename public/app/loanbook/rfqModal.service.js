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

        var orderModal = function(clickedLoan, selectedLoans) {
            var modalInstance = $uibModal.open({
                templateUrl: 'assets/app/loanbook/rfqModal.html',
                controller: OrderModalInstanceCtrl,
                resolve: {
                    clickedLoan: function() { return clickedLoan; },
                    selectedLoans: function() { return (selectedLoans.some(function(loan) { return loan.id === clickedLoan.id; })) ? selectedLoans : [clickedLoan]; }
                }
            });
        };

        function OrderModalInstanceCtrl($scope, $modalInstance, clickedLoan, selectedLoans, RfqService, AuthenticationService, AlertsService, FormUtilsService, Constants) {
            $scope.clickedLoan = clickedLoan;
            $scope.selectedLoans = selectedLoans;

            $scope.loading = false;

            $scope.form = {
                duration: null,
                creditEvent: [],
                counterparty: [Constants.automaticDealer],
                quoteWindow: null,
                cdsValue: null
            };

            $scope.conditions = {
                durationNotNumericNatural: function() {
                    var duration = $scope.form.duration;
                    return ( !FormUtilsService.isNumeric(duration) || duration <= 0 ) && duration !== null;
                },
                quoteWindowNotNumericNatural: function() {
                    var quoteWindow = $scope.form.quoteWindow;
                    return ( !FormUtilsService.isNumeric(quoteWindow) || quoteWindow <= 0 ) && quoteWindow !== null;
                },
                cdsValueNotNumericNatural: function() {
                    var cdsValue = $scope.form.cdsValue;
                    return ( !FormUtilsService.isNumeric(cdsValue) || cdsValue <= 0 ) && cdsValue !== null;
                },
                creditEventIsEmpty: function() {
                    return $scope.form.creditEvent.length === 0;
                },
                counterpartyIsEmpty: function() {
                    return $scope.form.counterparty.length === 0;
                },
                durationIsNull: function() {
                    return $scope.form.duration === null;
                },
                quoteWindowIsNull: function() {
                    return $scope.form.quoteWindow === null;
                },
                cdsValueIsNull: function() {
                    return $scope.form.cdsValue === null;
                }
            };

            $scope.conditionsNotMet = function() { return FormUtilsService.isAtLeastOneTrue($scope.conditions); };

            $scope.selectUtils = {
                banks: {
                    data: ["Dealer1", "Dealer2", "Dealer3", Constants.automaticDealer].filter(function(dealer) { return dealer != AuthenticationService.getCurrentAccount(); }),
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

            $scope.ok = function(conditionsNotMet) {
                if (!conditionsNotMet) {
                    $scope.loading = true;
                    RfqService.submitRfq(
                        $scope.form.duration,
                        $scope.form.creditEvent,
                        $scope.form.counterparty,
                        $scope.form.quoteWindow,
                        $scope.form.cdsValue,
                        AuthenticationService.getCurrentAccount(),
                        (selectedLoans) ? selectedLoans.map(function(loan) { return loan.id; }) : [loanId]
                    ).then(
                        AlertsService.rfq.success(function() {
                            closeModal();
                        }),
                        AlertsService.rfq.error(function() {
                            closeModal();
                        })
                    );
                }
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            function closeModal() {
                $scope.loading = false;
                $modalInstance.close();
            }
        }

        return {
            orderModal: orderModal
        };
    }
})();