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

    QuoteModalService.$inject = ['$uibModal'];

    function QuoteModalService($uibModal) {
        var quoteModal = function(loanId, originator, rfqId, timestamp, client, timeout) {
            var modalInstance = $uibModal.open({
                templateUrl: 'assets/app/quotes/quotesModal.html',
                controller: OrderModalInstanceCtrl,
                resolve: {
                    loanId: function() { return loanId; },
                    originator: function() { return originator; },
                    rfqId: function() { return rfqId; },
                    timestamp: function() { return timestamp; },
                    client: function() { return client; },
                    timeout: function() { return timeout; }
                }
            });
        };

        function OrderModalInstanceCtrl($scope, $modalInstance, loanId, originator, rfqId, timestamp, client, timeout, QuotesService, AuthenticationService, SweetAlert) {
            $scope.loanId = loanId;
            $scope.originator = originator;
            $scope.timeout = timeout;

            $scope.loading = false;

            $scope.form = {
                premium: 0,
                windowInMinutes: 0
            };

            $scope.conditions = {
                premiumNotNumeric: function() {
                    return !isNumeric($scope.form.premium);
                },
                windowInMinutesNotNumeric: function() {
                    return !isNumeric($scope.form.windowInMinutes);
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
                return $scope.conditions.premiumNotNumeric();
            };

            $scope.ok = function () {
                $scope.loading = true;
                QuotesService.submitQuote(
                    rfqId,
                    timestamp,
                    $scope.form.premium,
                    $scope.form.windowInMinutes,
                    client,
                    AuthenticationService.getCurrentAccount()
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