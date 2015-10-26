/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

var app = angular.module("app", ["ngResource", "ngRoute"])
    .constant("apiUrl", "/api")
    .config(["$routeProvider", function($routeProvider) {
      return $routeProvider
      .when("/", {
        templateUrl: "view/mainDashboard",
        controller: "MainDashboardCtrl"
      }).when("/logout", {
        templateUrl: "/logout"
      }).otherwise({
        redirectTo: "/"
      });
    }
    ]).config([
      "$locationProvider", function($locationProvider) {
        return $locationProvider.html5Mode({
          enabled: true,
          requireBase: false
        }).hashPrefix("!"); // enable the new HTML5 routing and history API
        // return $locationProvider.html5Mode(true).hashPrefix("!"); // enable the new HTML5 routing and history API
      }
    ]);

// the global controller
app.controller("AppCtrl", ["$scope", "$location", function($scope, $location) {
  // the go function is inherited by all other controllers
  $scope.go = function (path) {
    $location.path(path);
  };
}]);

