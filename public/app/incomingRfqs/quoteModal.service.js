/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
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
        var quoteModal = function(referenceEntities, rfqId, client, timeout) {
            var modalInstance = $uibModal.open({
                templateUrl: 'assets/app/incomingRfqs/quoteModal.html',
                controller: OrderModalInstanceCtrl,
                resolve: {
                    referenceEntities: function() { return referenceEntities; },
                    rfqId: function() { return rfqId; },
                    client: function() { return client; },
                    timeout: function() { return timeout; }
                }
            });
        };

        function OrderModalInstanceCtrl($scope, $modalInstance, referenceEntities, rfqId, client, timeout, QuotesService, AuthenticationService, AlertsService, FormUtilsService, LoanBookService) {
            $scope.timeout = timeout;
            $scope.loading = false;
            $scope.referenceEntities = [];

            LoanBookService.loanBookData().then(function(loans) {
                referenceEntities = referenceEntities.map(function(id) { return parseInt(id); });
                $scope.referenceEntities = loans.filter(function(loan) {
                    return referenceEntities.indexOf(loan.id) >= 0;
                });
            });

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

            $scope.conditionsNotMet = function() { return FormUtilsService.isAtLeastOneTrue($scope.conditions); };

            $scope.ok = function(conditionsNotMet) {
                if (!conditionsNotMet) {
                    $scope.loading = true;
                    QuotesService.submitQuote(
                        rfqId,
                        $scope.form.premium,
                        $scope.form.windowInMinutes,
                        client,
                        AuthenticationService.getCurrentAccount(),
                        AuthenticationService.getCurrentUsername(),
                        referenceEntities
                    ).then(
                        AlertsService.quote.success(function() {
                            closeModal();
                        }),
                        AlertsService.quote.error(function() {
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
            quoteModal: quoteModal
        };
    }
})();