'use strict';

var args = require('yargs').argv;
var constants = require('./gulp_tasks/common/constants')();
var resolutions = require('browserify-resolutions');
var webpack = require('./webpack.config');
var args = global.args || (process.env.ARGS ? JSON.parse(process.env.ARGS) : {});
var moduleManager = args.bundler ? args.bundler : constants.moduleManager;
var moduleEntry = args.module ? '/' + args.module : '';
var isWebpack = moduleManager === 'webpack';

module.exports = function(config) {
    var debug = false;
    try {
        debug = JSON.parse(args._[0]).debug;
    } catch (err) {}
    debug = debug || args.debug;

    var autowatch = true;
    try {
        autowatch = JSON.parse(args._[0]).autowatch;
    } catch (err) {}
    autowatch = autowatch || args.autowatch;

    var reporters = ['mocha', 'coverage'];

    var browserifyTestFiles = './<%=clientFolder%>/scripts' + moduleEntry + '/**/*.test.js';
    var webpackTestFiles = './<%=clientFolder%>/scripts' + moduleEntry + '/tests.webpack.js';

    var browserify = {
        debug: true,
        transform: [
            ['browserify-istanbul', {
                instrumenter: require('isparta'),
                ignore: ['**/*.test.js', '**/*.html', '**/bower_components/**', '**/node_modules/**', '**/externals/**/*.js', '**/<%=clientFolder%>/scripts/lbServices.js']
            }],
            ['babelify', {
                'stage': 0,
                'optional': ['es7.asyncFunctions'],
                'ignore': ['./node_modules', './bower_components', './externals']
            }]
        ],
        configure: function(bundle) {
            bundle.on('prebundle', function() {
                bundle.plugin(resolutions, '*');
            });
        }
    };

    webpack.cache = true;
    webpack.devtool = 'eval'; //'inline-source-map';
    webpack.module.preLoaders = webpack.module.preLoaders || [];
    webpack.module.preLoaders.push({
        test: /\.js$/,
        exclude: /(\.webpack\.js|\.test.js|node_modules|bower_components)/,
        //exclude: /(tests.webpack.js|.test.js|node_modules|bower_components|test)/,
        loader: 'istanbul-instrumenter'
    });

    var preprocessors = {};
    if (isWebpack) {
        preprocessors[webpackTestFiles] = ['webpack', 'sourcemap'];
    } else {
        preprocessors[browserifyTestFiles] = ['browserify'];
    }

    if (debug === true) {
        delete browserify.transform;
        reporters.splice(reporters.indexOf('coverage'), 1);
    }

    config.set({
        browserNoActivityTimeout: 120000,

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: isWebpack ? ['jasmine'] : ['browserify', 'jasmine'],

        // list of files / patterns to load in the browser
        files: [
            //'./client/scripts/**/*.html',
            isWebpack ? webpackTestFiles : browserifyTestFiles
        ],

        // list of files to exclude
        exclude: [
            './<%=clientFolder%>/scripts/bundle*.js',
            './<%=clientFolder%>/scripts/main*.js'
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: preprocessors,

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        //  reporters: ['dots', 'coverage'],
        reporters: reporters,

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_ERROR,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: autowatch,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,
        mochaReporter: {
            output: 'full'
        },

        coverageReporter: {
            dir : './coverage/unit',
            reporters: [{
                type: 'json'
            }, {
                type: 'text'
            }, {
                type: 'text-summary'
            }, {
                type: 'cobertura',
                file: 'coverage.xml'
            }, {
                type: 'lcov'
            }]
        },
        webpack: webpack,
        webpackMiddleware: {
            noInfo: true,
            stats: {
                hash: false,
                version: false,
                colors: true,
                moduleSort: 'name'
            }
        },
        browserify: browserify
    });
};
