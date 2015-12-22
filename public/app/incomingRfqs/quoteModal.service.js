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
* Created on 12/12/2015
*/

(function() {
    'use strict';

    angular
        .module('app')
        .factory('QuoteModalService', QuoteModalService);

    QuoteModalService.$inject = ['$uibModal', 'FormUtilsService'];

    function QuoteModalService($uibModal, FormUtilsService) {
        var quoteModal = function(loanId, originator, rfqId, client, timeout) {
            var modalInstance = $uibModal.open({
                templateUrl: 'assets/app/incomingRfqs/quoteModal.html',
                controller: OrderModalInstanceCtrl,
                resolve: {
                    referenceEntity: function() { return referenceEntity; },
                    originator: function() { return originator; },
                    rfqId: function() { return rfqId; },
                    client: function() { return client; },
                    timeout: function() { return timeout; }
                }
            });
        };

        function OrderModalInstanceCtrl($scope, $modalInstance, loanId, originator, rfqId, client, timeout, QuotesService, AuthenticationService, SweetAlert, FormUtilsService) {
            $scope.loanId = loanId;
            $scope.originator = originator;
            $scope.timeout = timeout;

            $scope.loading = false;

            $scope.form = {
                premium: null,
                windowInMinutes: null
            };

            $scope.conditions = {
                premiumNotNumericNatural: function() {
                    var premium = $scope.form.premium;
                    return ( !FormUtilsService.isNumeric(premium) || premium <= 0 ) && premium !== null;
                },
                windowInMinutesNotNumericNatural: function() {
                    var windowInMinutes = $scope.form.windowInMinutes;
                    return ( !FormUtilsService.isNumeric(windowInMinutes) || windowInMinutes <= 0 ) && windowInMinutes !== null;
                },
                premiumIsNull: function() {
                    return $scope.form.premium === null;
                },
                windowInMinutesIsNull: function() {
                    return $scope.form.windowInMinutes === null;
                }
            };

            var counter = setInterval(function () {
                if ($scope.timeout > 0) {
                    $scope.timeout = $scope.timeout - 1;
                }
                else {
                    $scope.timeout = "Expired";
                    clearInterval(counter);
                    closeModal();
                }
            }, 1000);

            $scope.submitButtonDisabled = function() {
                return $scope.conditions.premiumNotNumericNatural() ||
                    $scope.conditions.windowInMinutesNotNumericNatural() ||
                    $scope.conditions.premiumIsNull() ||
                    $scope.conditions.windowInMinutesIsNull();
            };

            $scope.ok = function () {
                $scope.loading = true;
                QuotesService.submitQuote(
                    rfqId,
                    $scope.form.premium,
                    $scope.form.windowInMinutes,
                    client,
                    AuthenticationService.getCurrentAccount(),
                    referenceEntity
                ).then( orderSuccess, orderError );
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
                    "Quote submitted !",
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
            quoteModal: quoteModal
        };
    }
})();