module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
        options: {
            separator: ';'
        },
        dist: {
            src: ['app/app.js', 'app/**/*.js'],
            dest: 'dist/<%= pkg.name %>.js'
        }
    },
    uglify: {
        options: {
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        dist: {
            files: {
                'dist/<%= pkg.name %>.js': ['<%= concat.dist.dest %>']
            },
            options: {
                mangle: false,
                compress: true
            }
        },
        bower: {
            files: {
                'dist/bower.js': 'dist/bower.js'
            },
            options: {
                mangle: false,
                compress: true
            }
        }
    },
    bower_concat: {
        all: {
            dest: 'dist/bower.js',
            mainFiles: {
                'font-awesome': 'css/font-awesome.min.css',
                'Flot': ['jquery.flot.js', 'jquery.flot.resize.js', 'jquery.flot.pie.js']
            }
        }
    },
    bower: {
        install: {
            options: {
                install: true,
                copy: false,
                targetDir: './libs',
                cleanTargetDir: true
            }
        }
    },
    jshint: {
        all: [ 'Gruntfile.js', 'app/*.js', 'app/**/*.js' ]
    }
  });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['bower', 'jshint', 'concat', 'uglify:dist', 'bower_concat', 'uglify:bower']);
    grunt.registerTask('dev', ['bower', 'jshint', 'concat', 'bower_concat']);
};