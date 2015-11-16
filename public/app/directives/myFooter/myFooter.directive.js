/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

/**
 * Created by julienderay on 16/11/2015.
 */

(function () {
    'use strict';

    angular
        .module('app')
        .directive('myFooter', myFooter);

    myFooter.$inject = [];

    function myFooter() {
        return {
            replace: true,
            restrict: 'E',
            scope: {
            },
            template: '<div class="footer"><div><strong>Copyright</strong> Lattice Markets &copy; 2014-2015</div></div>'
        };
    }
})();
