'use strict';
require('babel/register');
var argv = require('yargs').argv;
var coverage = require('./protractor/coverage');
var browserExtension = require('./protractor/browserExtension');
var byExtension = require('./protractor/byExtension');
var constants = require('./gulp_tasks/common/constants')();

var destScreenShots = './reports/screenshots';
var coveragePath = 'coverage/e2e/' + argv.target;
coverage.cleanFolder(coveragePath);
var isCI = process.env.CI === 'true';

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
        defaultTimeoutInterval: 400000,
        print: function() {}
    },
    onPrepare: function() {
        browser.manage().timeouts().setScriptTimeout(400000);
        //browser.driver.manage().window().maximize();
        browser.driver.manage().window().setSize(550, 900);

        browserExtension.extendsBrowser(browser, {
            destScreenShots: destScreenShots
        });

        byExtension.extendsBy(by);

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

if (argv.coverage) {
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
