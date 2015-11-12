/*eslint new-cap:0*/
'use strict';

global.Promise = require('bluebird');
var gulp = require('gulp');
var fs = require('fs');
var gutil = require('gulp-util');
var chalk = require('chalk');
var stripJsonComments = require('strip-json-comments');
var _ = require('lodash');
var path = require('path');
var gmux = require('gulp-mux');
var inquirer = require('inquirer');
var moment = require('moment');
var es = require('event-stream');
var XML = require('node-jsxml').XML;

/**
 * Returns true if the target application is mobile
 * It checks the presence of a cordova config file
 * @param  {Object}  constants - The constants
 * @returns {Boolean} - True if the target app is mobile, false otherwise
 */
var isMobile = function(constants) {
    return fs.existsSync('./' + constants.clientFolder + '/config' + constants.targetSuffix + '.xml');
};

/**
 * A generic handler for require('child_process').exec
 * @param  {Object} err - The error object
 * @param  {String} stdout - The stdout string
 * @param  {String} stderr - The stderr string
 * @param  {Object} [opts] - The optional options object
 * @param  {Boolean} [opts.throwOnError=false] - Ask execHandler to throw
 * @param  {Boolean} [opts.stderrIsNotError=false] - Don't treat stderr as error info.
 */
var execHandler = function(err, stdout, stderr, opts) {
    opts = opts || {};
    if (stdout) {
        gutil.log(stdout);
    }
    if (stderr) {
        if (opts.stderrIsNotError) {
            gutil.log(stderr);
        } else {
            gutil.log(chalk.red('Error: ') + stderr);
        }
    }
    if (err) {
        gutil.log(chalk.red('An error occured executing a command line action'));
        gutil.log(chalk.red(err));
        if (opts.throwOnErr) {
            throw err;
        }
    }
};

var readTextFile = function(filename) {
    var body = fs.readFileSync(filename, 'utf8');
    return body;
};

var readJsonFile = function(filename) {
    var body = readTextFile(filename);
    return JSON.parse(stripJsonComments(body));
};

var writeTextFile = function(filename, body) {
    fs.writeFileSync(filename, body);
};

var writeJsonFile = function(filename, json) {
    var body = JSON.stringify(json);
    writeTextFile(filename, body);
};

var filterFiles = function(files, extension) {
    return _.filter(files, function(file) {
        return path.extname(file) === extension;
    });
};

var targetToTemplateData = function(target, mode) {
    return {
        targetName: target,
        targetSuffix: gmux.targets.targetToSuffix(target),
        mode: mode
    };
};

var getLatestBuild = function(dest, builds) {
    return _(builds).map(function(build) {
            if (fs.existsSync(dest + '/' + build.path)) {
                build.mtime = fs.statSync(dest + '/' + build.path).mtime;
                build.fullPath = dest + '/' + build.path;
            }
            return build;
        })
        .filter('mtime')
        .sortBy('mtime')
        .last();
};

var findAndroidFile = function(dest) {
    var builds = [{
        path: 'platforms/android/build/outputs/apk/android-armv7-debug.apk'
    }, {
        path: 'platforms/android/build/outputs/apk/android-debug.apk'
    }, {
        path: 'platforms/android/ant-build/MainActivity-debug.apk'
    }];
    return getLatestBuild(dest, builds);
};

var findIOSFile = function(dest, appname) {
    var builds = [{
        path: 'platforms/ios/build/device/' + appname + '.ipa'
    }];
    return getLatestBuild(dest, builds);
};

var checkFileAge = function(file) {
    return new Promise(function(resolve, reject) {
        var stats = fs.statSync(file.fullPath);
        var age = moment().diff(stats.mtime);

        if (age && age >= 5 * 60 * 1000) {

            gutil.log(gutil.colors.yellow('Warning: the following file ') + file.path);
            gutil.log(gutil.colors.yellow('was modified more than ') + moment(stats.mtime).fromNow());
            gutil.log(file);
            var questions = [{
                type: 'confirm',
                message: 'Continue deployment anyway?',
                name: 'continue'
            }];
            inquirer.prompt(questions, function(answers) {
                if (answers.continue === false) {
                    reject(new Error('file is old'));
                }
                resolve(null);
            });

        } else {
            resolve(null);
        }
    });
};
var resolveSentryNormalizedUrl = function(constants) {
    var value = constants.sentry.normalizedURL;
    if (value === true) {
        return 'http://' + constants.serve.host + ':' + constants.serve.port;
    }
    if (!value) {
        return '';
    }
    return value;
};

var getEnvifyVars = function(constants) {
    var version = readJsonFile('./package.json').version;
    var dest = constants.dist.distFolder;
    dest = isMobile(constants) ? dest + '/www/' + constants.script.dest : dest + '/' + constants.script.dest;
    var mode = constants.mode;
    var target = constants.targetName;
    var bundleName = constants.bundleName || 'bundle.js';
    var releaseName = target + '-v' + version;
    var envifyVars = {
        APP_VERSION: version,
        SENTRY_CLIENT_KEY: constants.sentry.targetKeys[target],
        SENTRY_RELEASE_NAME: releaseName,
        SENTRY_MODE: mode,
        SENTRY_NORMALIZED_URL: resolveSentryNormalizedUrl(constants),
        SENTRY_BUNDLE_NAME: bundleName,
        TARGET: target
    };
    if (isMobile(constants)) {
        var srcxml = './' + constants.clientFolder + '/config' + constants.targetSuffix + '.xml';
        var configFileContent = readTextFile(srcxml);
        var xml = new XML(configFileContent);
        envifyVars.APP_NAME = xml.child('name').getValue();
        envifyVars.APP_ID = xml.attribute('id').getValue();
        envifyVars.APP_AUTHOR = xml.child('author').getValue();
        envifyVars.TESTFAIRY_IOS_APP_TOKEN = constants.testfairy.ios_app_token;
        if (constants.ionic[target]) {
            envifyVars.IONIC_APP_ID = constants.ionic[target].app_id;
            envifyVars.IONIC_API_KEY = constants.ionic[target].api_key;
        }

    } else {
        envifyVars.APP_NAME = constants.appname;
    }
    return envifyVars;
};

var getBanner = function() {
    var packageJson = readJsonFile('./package.json');
    return _.template(['/**',
        ' * <%= pkg.name %> - <%= pkg.description %>',
        ' * @date <%= new Date() %>',
        ' * @version v<%= pkg.version %>',
        ' * @link <%= pkg.homepage %>',
        ' * @license <%= pkg.license %>',
        ' */',
        ''
    ].join('\n'))({
        pkg: packageJson
    });
};

/**
 * Add new sources in a gulp pipeline
 * @returns {Stream} A gulp stream
 * @example
 * gulp.src('')
 * .pipe(addSrc('CHANGELOG.md'))
 * .gulp.dest();
 */
var addSrc = function() {
    var pass = es.through();
    return es.duplex(pass, es.merge(gulp.src.apply(gulp.src, arguments), pass));
};

module.exports = {
    isMobile: isMobile,
    execHandler: execHandler,
    readTextFile: readTextFile,
    readJsonFile: readJsonFile,
    writeTextFile: writeTextFile,
    writeJsonFile: writeJsonFile,
    filterFiles: filterFiles,
    targetToTemplateData: targetToTemplateData,
    checkFileAge: checkFileAge,
    findAndroidFile: findAndroidFile,
    findIOSFile: findIOSFile,
    getEnvifyVars: getEnvifyVars,
    getBanner: getBanner,
    resolveSentryNormalizedUrl: resolveSentryNormalizedUrl,
    addSrc: addSrc
};
