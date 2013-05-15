'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.jds'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'
// templateFramework: 'lodash'

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var basementConfig = {
        app: 'app',
        dist: 'dist'
    };

    grunt.initConfig({
        basement: basementConfig,
        watch: {
            coffee: {
                files: ['<%= basement.app %>/scripts/{,*/}*.coffee'],
                tasks: ['coffee:dist']
            },
            jade: {
                files: ["<%= basement.app %>/index.jade"],
                tasks: ["jade"]
            },
            less: {
                files: ['<%= basement.app %>/styles/{,*/}*.less'],
                tasks: ['less:server']
            },
            livereload: {
                files: [
                    '<%= basement.app %>/*.html',
                    '.tmp/index.html',
                    '{.tmp,<%= basement.app %>}/styles/{,*/}*.css',
                    '{.tmp,<%= basement.app %>}/scripts/{,*/}*.js',
                    '<%= basement.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}'
                ],
                tasks: ['livereload']
            }
        },
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'app')
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },
        clean: {
            dist: ['.tmp', '<%= yeoman.dist %>/*'],
            server: '.tmp'
        },
        coffee: {
            dist: {
                files: [{
                    // rather than compiling multiple files here you should
                    // require them into your main .coffee file
                    expand: true,
                    cwd: '<%= basement.app %>/scripts',
                    src: '**/*.coffee',
                    dest: '.tmp/scripts',
                    ext: '.js'
                }]
            }
        },
        jade: {
            compile: {
                src: ['<%= basement.app %>/index.jade'],
                dest: '.tmp/index.html',
                options: {
                    client: false,
                    pretty: true
                }
            }
        },
        less: {
            options: {
                paths: ['app/components'],
                cssDir: '.tmp/styles',
                imagesDir: '<%= basement.app %>/images',
                javascriptsDir: '<%= basement.app %>/scripts',
                fontsDir: '<%= basement.app %>/styles/fonts',
                importPath: 'app/bower_components',
                relativeAssets: true
            },
            server: {
                options: {
                    paths: ["<%= basement.app %>/styles"],
                    yuicompress: true
                },
                files: {
                    ".tmp/styles/main.css": "<%= basement.app %>/styles/main.less"
                }
            }
        },

        requirejs: {
            dist: {
                // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
                options: {
                    // `name` and `out` is set by grunt-usemin
                    baseUrl: 'app/scripts',
                    optimize: 'none',
                    paths: {
                        'templates': '../../.tmp/scripts/templates'
                    },
                    // TODO: Figure out how to make sourcemaps work with grunt-usemin
                    // https://github.com/yeoman/grunt-usemin/issues/30
                    //generateSourceMaps: true,
                    // required to support SourceMaps
                    // http://requirejs.org/docs/errors.html#sourcemapcomments
                    preserveLicenseComments: false,
                    useStrict: true,
                    wrap: true,
                    //uglify2: {} // https://github.com/mishoo/UglifyJS2
                }
            }
        },
        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            options: {
                dirs: ['<%= yeoman.dist %>']
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= basement.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/styles/main.css': [
                        '.tmp/styles/{,*/}*.css',
                        '<%= basement.app %>/styles/{,*/}*.css'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '<%= basement.app %>',
                    src: '*.html',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= basement.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,txt}',
                        '.htaccess',
                        'images/{,*/}*.{webp,gif}'
                    ]
                }]
            }
        },
        bower: {
            all: {
                rjsConfig: '<%= basement.app %>/scripts/main.js'
            }
        }
    });

	grunt.renameTask('regarde', 'watch');
    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'coffee:dist',
            'jade',
            //'createDefaultTemplate',
            'less:server',
            'livereload-start',
            'connect:livereload',
            //'open',
            'watch'
        ]);
    });


    grunt.registerTask('default', ['livereload-start', 'connect', 'watch']);

};
