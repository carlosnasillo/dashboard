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
                duration: null,
                creditEvent: [],
                counterparty: [],
                quoteWindow: null,
                cdsValue: null
            };

            $scope.conditions = {
                durationNotNumericNatural: function() {
                    var duration = $scope.form.duration;
                    return ( !isNumeric(duration) || duration <= 0 ) && duration !== null;
                },
                quoteWindowNotNumericNatural: function() {
                    var quoteWindow = $scope.form.quoteWindow;
                    return ( !isNumeric(quoteWindow) || quoteWindow <= 0 ) && quoteWindow !== null;
                },
                cdsValueNotNumericNatural: function() {
                    var cdsValue = $scope.form.cdsValue;
                    return ( !isNumeric(cdsValue) || cdsValue <= 0 ) && cdsValue !== null;
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

            $scope.submitButtonDisabled = function() {
                return $scope.conditions.durationNotNumericNatural() ||
                    $scope.conditions.durationIsNull() ||
                    $scope.conditions.quoteWindowNotNumericNatural() ||
                    $scope.conditions.quoteWindowIsNull() ||
                    $scope.conditions.cdsValueNotNumericNatural() ||
                    $scope.conditions.cdsValueIsNull() ||
                    $scope.conditions.creditEventIsEmpty() ||
                    $scope.conditions.counterpartyIsEmpty();
            };

            $scope.selectUtils = {
                banks: {
                    data: ["Dealer1", "Dealer2", "Dealer3"].filter(function(dealer) { return dealer != AuthenticationService.getCurrentAccount(); }),
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
                return (!isNaN(parseFloat(n)) && isFinite(n)) || n === null;
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