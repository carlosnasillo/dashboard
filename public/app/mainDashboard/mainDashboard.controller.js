/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

/**
 * Created by julienderay on 26/10/2015.
 */

// the list controller
(function () {
    'use strict';

    angular
        .module('app')
        .controller('MainDashboardCtrl', MainDashboardCtrl);

    MainDashboardCtrl.$inject = ["$scope", "$resource", "apiUrl"];
    function MainDashboardCtrl($scope, $resource, apiUrl) {
        var Analytics = $resource(apiUrl + "/analytics"); // a RESTful-capable resource object
        $scope.analytics = Analytics.query(); // for the list of analytics in public/html/mainDashboard.html
    }

})();