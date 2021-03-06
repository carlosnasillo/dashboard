/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 *
 */

module.exports = function(grunt) {

grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
        options: {
            separator: ';'
        },
        dist: {
            src: ['public/app/app.js', 'public/app/**/*.js'],
            dest: 'public/dist/<%= pkg.name %>.js'
        }
    },
    uglify: {
        options: {
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        dist: {
            files: {
                'public/dist/<%= pkg.name %>.js': ['<%= concat.dist.dest %>']
            },
            options: {
                mangle: false,
                compress: true
            }
        },
        bower: {
            files: {
                'public/dist/bower.js': 'public/dist/bower.js'
            },
            options: {
                mangle: false,
                compress: true
            }
        }
    },
    bower_concat: {
        all: {
            dest: 'public/dist/bower.js',
            mainFiles: {
                'font-awesome': 'css/font-awesome.min.css'
            }
        }
    },
    bower: {
        install: {
            options: {
                install: true,
                copy: false,
                targetDir: '.libs',
                cleanTargetDir: true
            }
        }
    },
    bowercopy: {
        options: {
            runBower: false,
            srcPrefix: 'bower_components'
        },
        fontawesome: {
            options: {
                destPrefix: 'public/fonts'
            },
            files: {
                'fontawesome-webfont.woff': 'font-awesome/fonts/fontawesome-webfont.woff',
                'fontawesome-webfont.woff2': 'font-awesome/fonts/fontawesome-webfont.woff2',
                'fontawesome-webfont.ttf': 'font-awesome/fonts/fontawesome-webfont.ttf'
            }
        },
        uigridfonts: {
            options: {
                destPrefix: 'public/dist'
            },
            files: {
                'ui-grid.woff': 'angular-ui-grid/ui-grid.woff',
                'ui-grid.ttf': 'angular-ui-grid/ui-grid.ttf'
            }
        },
        chosen: {
            options: {
                destPrefix: 'public/dist'
            },
            files: {
                'chosen-sprite.png': 'chosen/chosen-sprite.png',
                'chosen-sprite@2x.png': 'chosen/chosen-sprite@2x.png'
            }
        }
    },
    jshint: {
        all: [ 'Gruntfile.js', 'public/app/*.js', 'public/app/**/*.js' ]
    },
    watch: {
        dev: {
            files: [ 'Gruntfile.js', 'public/app/**/*.js', 'public/**/*.html' ],
            tasks: [ 'jshint', 'concat', 'concat_css', 'bowercopy' ],
            options: {
                atBegin: true
            }
        },
        test: {
            files: [ 'Gruntfile.js', 'public/app/**/*.js', 'public/**/*.html', 'test/front/unit/**/*.spec.js' ],
            tasks: [ 'jshint', 'concat', 'concat_css', 'bowercopy', 'jasmine' ],
            options: {
                atBegin: true
            }
        }
    },
    concat_css: {
        options: {},
        all: {
            src: [
                "bower_components/bootstrap/dist/css/bootstrap.min.css",
                "bower_components/font-awesome/css/font-awesome.min.css",
                "bower_components/angular-ui-grid/ui-grid.min.css",
                "bower_components/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css",
                "bower_components/sweetalert/dist/sweetalert.css",
                "bower_components/bootstrap-daterangepicker/daterangepicker.css",
                "bower_components/c3/c3.min.css",
                "public/stylesheets/popover-custom.css",
                "bower_components/chosen/chosen.min.css",
                "bower_components/angular-notify/dist/angular-notify.css"
            ],
            dest: "public/dist/styles.css"
        }
    },
    jasmine : {
        // Your project's source files
        src : ['public/dist/bower.js', 'public/app/**/*.js'],
        // Your Jasmine spec files
        options: {
            specs : 'test/front/unit/**/*.spec.js'
        }
    }
});

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concat-css');
    grunt.loadNpmTasks('grunt-bowercopy');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    grunt.registerTask('default', ['jshint', 'bower', 'bower_concat', 'uglify:bower', 'concat', 'uglify:dist', 'concat_css', 'bowercopy']);
    grunt.registerTask('dist', ['bower', 'bower_concat', 'uglify:bower', 'concat', 'uglify:dist', 'concat_css', 'bowercopy']);
    grunt.registerTask('test', ['jshint','jasmine']);
    grunt.registerTask('dev', ['bower', 'bower_concat', 'watch:dev']);
    grunt.registerTask('dev-test', ['bower', 'bower_concat', 'watch:test']);
};