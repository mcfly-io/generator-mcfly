'use strict';
var constants = require('./gulp_tasks/common/constants')();
exports.config = {
    //seleniumAddress: 'http://localhost:4444/wd/hub',
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
        'phantomjs.binary.path': require('phantomjs').path,
        'phantomjs.ghostdriver.cli.args': ['--loglevel=VERBOSE']
    },
    baseUrl: 'http://localhost:' + constants.e2e.port,
    jasmineNodeOpts: {
        showColors: true,
        silent: true,
        includeStackTrace: true,
        defaultTimeoutInterval: 30000,
        print: function() {}
    },
    onPrepare: function() {
        browser.manage().timeouts().setScriptTimeout(30000);
        browser.driver.manage().window().setSize(1600, 800);

        var disableNgAnimate = function() {
            window.angular.module('disableNgAnimate', []).run(['$animate', function($animate) {
                $animate.enabled(false);
            }]);
        };
        browser.addMockModule('disableNgAnimate', disableNgAnimate);

        //browser.executeScript('window.name = "NG_ENABLE_DEBUG_INFO"'); // see https://github.com/angular/protractor/issues/2116

        require('jasmine-reporters');
        var SpecReporter = require('jasmine-spec-reporter');
        var HtmlReporter = require('protractor-html-screenshot-reporter');
        var path = require('path');
        jasmine.getEnv().addReporter(new SpecReporter({
            displaySpecDuration: true,
            displayStacktrace: true
        }));
        jasmine.getEnv().addReporter(new HtmlReporter({
            baseDirectory: './reports/screenshots',
            takeScreenShotsOnlyForFailedSpecs: false,
            docName: 'index.html',
            pathBuilder: function(spec, descriptions, results, capabilities) {
                // Return '<browser>/<specname>' as path for screenshots:
                // Example: 'firefox/list-should work'.
                return path.join(capabilities.caps_.browserName, descriptions.join('-'));
            }
        }));
    }
};
