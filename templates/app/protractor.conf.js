'use strict';
require('babel/register');
var argv = require('yargs').argv;
var coverage = require('./protractor/coverage');
var browserExtension = require('./protractor/browserExtension');
var byExtension = require('./protractor/byExtension');
var constants = require('./gulp_tasks/common/constants')();
var helper = require('./gulp_tasks/common/helper');
var destScreenShots = './reports/screenshots';
var target = argv.target;
var targetSuffix = require('gulp-mux').targets.targetToSuffix(target);
var coveragePath = 'coverage/e2e/' + argv.target;
coverage.cleanFolder(coveragePath);
var isMobile = helper.isMobile({
    clientFolder: constants.clientFolder,
    targetSuffix: targetSuffix
});
var isCI = process.env.CI === 'true';
var timeout = 400000;
var config = {
    //seleniumAddress: 'http://localhost:4445/wd/hub',
    //seleniumServerJar: './node_modules/gulp-protractor/node_modules/protractor/selenium/selenium-server-standalone-2.43.1.jar',
    //specs: ['test/e2e/**/*.js'],
    framework: 'jasmine2',
    capabilities: {
        browserName: 'chrome',
        chromeOption: {
            args: ['--disable - extensions ']
        },
        version: '',
        platform: 'ANY',
        name: 'App Tests',
        'phantomjs.binary.path': require('phantomjs').path,
        'phantomjs.ghostdriver.cli.args': ['--loglevel=VERBOSE']
    },

    baseUrl: 'http://localhost:' + constants.e2e.port,
    jasmineNodeOpts: {
        showColors: true,
        silent: true,
        includeStackTrace: true,
        defaultTimeoutInterval: timeout,
        print: function() {}
    },
    onPrepare: function() {
        browserExtension.extendsBrowser(browser, {
            destScreenShots: destScreenShots
        });

        byExtension.extendsBy(by);

        browser.manage().timeouts().setScriptTimeout(timeout);

        if (isMobile) {
            browser.driver.manage().window().setSize(550, 900);
        } else {
            browser.maximizeWindow();
        }

        require('jasmine-reporters');
        var SpecReporter = require('jasmine-spec-reporter');
        var HtmlReporter = require('protractor-jasmine2-screenshot-reporter');
        jasmine.getEnv().addReporter(new SpecReporter({
            displaySpecDuration: true,
            displayStacktrace: true
        }));
        jasmine.getEnv().addReporter(new HtmlReporter({
            dest: destScreenShots,
            filename: 'index.html'
        }));
    }

};
if (isCI) {
    config.sauceUser = process.env.SAUCE_USERNAME;
    config.sauceKey = process.env.SAUCE_ACCESS_KEY;
    config.capabilities['tunnel-identifier'] = process.env.TRAVIS_JOB_NUMBER;
    config.capabilities.build = process.env.TRAVIS_BUILD_NUMBER;
    config.avoidProxy = true;

} else {
    config.directConnect = true;
}

if (argv.coverage === true || argv.coverage === 'true') {
    config.plugins = config.plugins || [];
    config.plugins.push({
        package: 'protractor-istanbul-plugin',
        outputPath: coveragePath
    });
    if (config.onComplete) {
        throw new Error('onComplete already exists and cannot be overriden');
    }
    config.onComplete = function() {
        coverage.generateCoverageReports(coveragePath);
    };

}

exports.config = config;
