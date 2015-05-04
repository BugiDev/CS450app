'use strict';

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    var dateForJsHintReport = new Date();

    // Configurable paths for the application
    var appConfig = {
        app: require('./bower.json').appPath || 'app',
        build: 'build',
        deploy: 'deploy',
        optimizedCSSOutFileName: 'cs450app.css',
        optimizedJSOutFileName: 'cs450app.js'
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        projectConf: appConfig,

        // Make sure code css are up to par and there are no obvious mistakes
        jshint: {
            dev: {
                src: [
                    'Gruntfile.js',
                    '<%= projectConf.app %>/js/{,*/}*.js'
                ],
                options: {
                    jshintrc: '.jshintrc',
                    reporter: require('jshint-stylish')
                }
            },
            deploy: {
                src: [
                    'Gruntfile.js',
                    '<%= projectConf.deploy %>/js/{,*/}*.js'
                ],
                options: {
                    jshintrc: '.jshintrc',
                    reporter: require('jshint-stylish'),
                    reporterOutput: 'jsHintErrors/dev/' + dateForJsHintReport.getMonth() + 1 + '.' + dateForJsHintReport.getDate() + '.' + dateForJsHintReport.getFullYear() + '-' + dateForJsHintReport.getHours() + '.' + dateForJsHintReport.getMinutes() + '.' + dateForJsHintReport.getSeconds() + '-error.log.xml'
                }
            },
            test: {
                src: ['test/spec/{,*/}*.js'],
                options: {
                    jshintrc: 'test/.jshintrc',
                    reporter: require('jshint-stylish'),
                    reporterOutput: 'jsHintErrors/test/' + dateForJsHintReport.getMonth() + 1 + '.' + dateForJsHintReport.getDate() + '.' + dateForJsHintReport.getFullYear() + '-' + dateForJsHintReport.getHours() + '.' + dateForJsHintReport.getMinutes() + '.' + dateForJsHintReport.getSeconds() + '-error.log.xml'
                }
            }
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            dev:{
                files: [
                    '<%= projectConf.app %>/js/{,*/}*.js',
                    '<%= projectConf.app %>/css/{,*/}*.css',
                    '<%= projectConf.app %>/{,*/}*.html',
                    '<%= projectConf.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    'Gruntfile.js'
                ],
                tasks: ['build'],
                options: {
                    livereload: '<%= connect.dev.options.livereload %>'
                }
            },
            build:{
                files: [
                    '<%= projectConf.app %>/js/{,*/}*.js',
                    '<%= projectConf.app %>/css/{,*/}*.css',
                    '<%= projectConf.app %>/{,*/}*.html',
                    '<%= projectConf.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    'Gruntfile.js'
                ],
                tasks: ['build-optimized'],
                options: {
                    livereload: '<%= connect.dev.options.livereload %>'
                }
            },
            deploy:{
                files: [
                    '<%= projectConf.app %>/js/{,*/}*.js',
                    '<%= projectConf.app %>/css/{,*/}*.css',
                    '<%= projectConf.app %>/{,*/}*.html',
                    '<%= projectConf.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    'Gruntfile.js'
                ],
                tasks: ['deploy'],
                options: {
                    livereload: '<%= connect.deploy.options.livereload %>'
                }
            },
            test: {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['newer:jshint:test', 'karma']
            }
        },

        // Empties folders to start fresh
        clean: {
            build:['build'],
            deploy:['deploy']
        },

        // Add vendor prefixed css
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= projectConf.build %>/css/',
                    src: '{,*/}*.css',
                    dest: '<%= projectConf.build %>/css/'
                }]
            }
        },

        cssmin: {
            build: {
                files: {
                    '<%= projectConf.build %>/css/<%= projectConf.optimizedCSSOutFileName %>' : ['<%= projectConf.build %>/css/*.css']
                }
            }
        },

        // The following *-min tasks produce minified files in the deploy folder
        imagemin: {
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= projectConf.deploy %>/images',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= projectConf.deploy %>/images'
                }]
            }
        },
        svgmin: {
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= projectConf.deploy %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= projectConf.deploy %>/images'
                }]
            }
        },
        htmlmin: {
            build: {
                options: {
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= projectConf.deploy %>',
                    src: ['*.html', 'js/**/*.html'],
                    dest: '<%= projectConf.deploy %>'
                }]
            }
        },

        // ng-annotate tries to make the code safe for minification automatically
        // by using the Angular long form for dependency injection.
        ngAnnotate: {
            build: {
                files: [{
                    expand: true,
                    // cwd: '<%= yeoman.app %>/js',
                    src: ['<%= projectConf.build %>/js/**/*.js'],
                    dest: ''
                }]
            }
        },

        // Replace Google CDN references
        cdnify: {
            build: {
                html: ['<%= projectConf.deploy %>/*.html']
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            build:{
                cwd: '<%= projectConf.app %>',
                src: ['**'],
                dest: '<%= projectConf.build %>',
                expand: true
            },
            deploy:{
                cwd: '<%= projectConf.build %>',
                src: ['**/*', '!css/*', '**/css/<%= projectConf.optimizedCSSOutFileName %>', '!js/**/*.js', '**/js/<%= projectConf.optimizedJSOutFileName %>'],
                dest: '<%= projectConf.deploy %>',
                expand: true
            }
        },

        // Test settings
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        },

        // r.js compile config
        requirejs: {
            build: {
                options: {
                    preserveLicenseComments: true, // remove all comments
                    removeCombined: true,
                    baseUrl: '<%= projectConf.build %>/js',
                    mainConfigFile: '<%= projectConf.build %>/js/main.js',
                    optimize: 'none',
                    include: ['main.js','../bower_components/requirejs/require.js'],
                    findNestedDependencies: true,
                    out:'<%= projectConf.build %>/js/<%= projectConf.optimizedJSOutFileName %>'
                }
            },
            deploy: {
                options: {
                    preserveLicenseComments: false, // remove all comments
                    removeCombined: true,
                    baseUrl: '<%= projectConf.build %>/js',
                    mainConfigFile: '<%= projectConf.build %>/js/main.js',
                    optimize: 'uglify2',
                    uglify2: {
                        mangle: false
                    },
                    include: ['main.js','../bower_components/requirejs/require.js'],
                    findNestedDependencies: true,
                    out:'<%= projectConf.deploy %>/js/<%= projectConf.optimizedJSOutFileName %>'
                }
            }
        },
        toggleComments: {
            customOptions: {
                options: {
                    padding: 4,
                    removeCommands: true
                },
                files: {
                    'build/index.html': 'build/index.html'
                }
            }
        }
    });

    grunt.registerTask('build',[
        'clean:build',
        'jshint:dev',
        'copy:build',
        'autoprefixer',
        'cssmin',
        'ngAnnotate'
    ]);

    grunt.registerTask('build-optimized',[
        'build',
        'requirejs:build',
        'toggleComments'
    ]);

    grunt.registerTask('deploy',[
        'clean:build',
        'clean:deploy',
        'jshint:deploy',
        'copy:build',
        'autoprefixer',
        'cssmin',
        'ngAnnotate',
        'toggleComments',
        'copy:deploy',
        /*'imagemin',
        'svgmin',*/
        /*'cdnify',*/
        'htmlmin',
        'requirejs:deploy'
    ]);

};
