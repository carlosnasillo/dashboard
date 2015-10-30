/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

/**
* @author: julienderay
* Created on 29/10/2015
*/
(function (){
    'use strict';

    angular
        .module('app')
        .directive('myMinimalizeSidebar', myMinimalizeSidebar);

    myMinimalizeSidebar.$inject= ['$timeout'];

    function myMinimalizeSidebar() {
        return {
        restrict: 'A',
            template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" data-ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
            controller: controller
        };
    }

    var controller = function ($scope, $timeout) {
        $scope.minimalize = function () {
            var body = $("body");
            body.toggleClass("mini-navbar");
            if (!body.hasClass('mini-navbar') || body.hasClass('body-small')) {
                // Hide menu in order to smoothly turn on when maximize menu
                $('#side-menu').hide();
                // For smoothly turn on menu
                $timeout(
                    function () {
                        $('#side-menu').fadeIn(500);
                    }, 100);
            } else if (body.hasClass('fixed-sidebar')) {
                $('#side-menu').hide();
                $timeout(
                    function () {
                        $('#side-menu').fadeIn(500);
                    }, 300);
            } else {
                // Remove all inline style from jquery fadeIn function to reset menu state
                $('#side-menu').removeAttr('style');
            }
        }
    };
})();

