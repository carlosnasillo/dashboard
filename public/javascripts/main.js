var app = angular.module("app", ["ngResource", "ngRoute"])
    .constant("apiUrl", "/api")
    .config(["$routeProvider", function($routeProvider) {
      return $routeProvider
      .when("/", {
        templateUrl: "/views/mainDashboard",
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

// the list controller
app.controller("MainDashboardCtrl", ["$scope", "$resource", "apiUrl", function($scope, $resource, apiUrl) {
  var Analytics = $resource(apiUrl + "/analytics"); // a RESTful-capable resource object
  $scope.analytics = Analytics.query(); // for the list of analytics in public/html/mainDashboard.html
}]);