/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 */

/**
 * Created by julienderay on 09/11/2015.
 */

(function () {
    'use strict';

    angular
        .module('app')
        .factory('LoansService', function ($http) {
            var loansAvailablePromise = null;
            var ownedNotesPromise = null;

            var loansAvailable = function() {
                if (loansAvailablePromise) {
                    return loansAvailablePromise;
                } else {
                    loansAvailablePromise = $http.get("/api/loans");
                    return loansAvailablePromise;
                }
            };

            var submitOrder = function(investorId, loanId, amount) {
                return $http.post('/api/placeOrder', { investorId: investorId, loanId: loanId, amount: amount });
            };

            var ownedNotes = function(investorId) {
                if (ownedNotesPromise) {
                    return ownedNotesPromise;
                } else {
                    ownedNotesPromise = $http.get("/api/ownedNotes/" + investorId);
                    return ownedNotesPromise;
                }
            };

            return {
                loansAvailable: loansAvailable,
                submitOrder: submitOrder,
                ownedNotes: ownedNotes
            };
        });
})();