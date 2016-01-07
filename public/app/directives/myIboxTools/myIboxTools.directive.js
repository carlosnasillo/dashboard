/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 *
 */

/**
* Created by Julien Déray on 29/10/2015.
*/

(function () {
    'use strict';

    angular
        .module('app')
        .directive('myIboxTools', myIboxTools);

    myIboxTools.$inject = ['$timeout'];

    function myIboxTools() {
        return {
            restrict: 'A',
            scope: true,
            templateUrl: 'assets/app/directives/myIboxTools/my-ibox-tools.html',
            controller: controller
        };
    }

    var controller = function ($scope, $element, $timeout) {
        // Function for collapse ibox
        $scope.showhide = function () {
            var ibox = $element.closest('div.ibox');
            var icon = $element.find('i:first');
            var content = ibox.find('div.ibox-content');
            content.slideToggle(200);
            // Toggle icon from up to down
            icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
            ibox.toggleClass('').toggleClass('border-bottom');
            $timeout(function () {
                ibox.resize();
                ibox.find('[id^=map-]').resize();
            }, 50);
        };
    };
})();