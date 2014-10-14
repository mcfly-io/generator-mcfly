'use strict';

exports.config = {
    //seleniumAddress: 'http://localhost:4444/wd/hub',
    seleniumServerJar: './node_modules/gulp-protractor/node_modules/protractor/selenium/selenium-server-standalone-2.43.1.jar',
    //specs: ['spec.js'],
    capabilities: {
        browserName: 'phantomjs',
        version: '',
        platform: 'ANY',
        'phantomjs.binary.path': './node_modules/karma-phantomjs-launcher/node_modules/phantomjs/bin/phantomjs'
    },
    jasmineNodeOpts: {
        showColors: true,
        silent: true,
        defaultTimeoutInterval: 30000
    },
    onPrepare: function() {
        browser.driver.manage().window().setSize(1600, 800);
        //var folderName = ''; // (new Date()).toString().split(' ').splice(1, 4).join(' ');
        //var mkdirp = require('mkdirp');
        //var newFolder = './reports/' + folderName;

        require('jasmine-reporters');
        require('jasmine-spec-reporter');
        var HtmlReporter = require('protractor-html-screenshot-reporter');
        jasmine.getEnv().addReporter(new jasmine.SpecReporter({
            displaySpecDuration: true,
            displayStacktrace: true
        }));
        jasmine.getEnv().addReporter(new HtmlReporter({
            baseDirectory: 'reports/screenshots',
            docName: 'index.html',
            takeScreenShotsOnlyForFailedSpecs: false
        }));
        //         mkdirp(newFolder, function(err) {
        //             if(err) {
        //                 console.error(err);
        //             } else {
        //                 //jasmine.getEnv().addReporter(new jasmine.JUnitXmlReporter('reports', true, true));
        //                 //jasmine.getEnv().addReporter(new jasmine.ConsoleReporter());
        //                 jasmine.getEnv().addReporter(new jasmine.SpecReporter({
        //                     displayStacktrace: true
        //                 }));
        //                 jasmine.getEnv().addReporter(new HtmlReporter({
        //                     baseDirectory: 'reports/screenshots',
        //                     docName: 'index.html',
        //                     takeScreenShotsOnlyForFailedSpecs: false
        //                 }));
        //             }
        //         });
    },
};