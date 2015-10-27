'use strict';
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var configOptions;
var browserObj;

var shot = function(filename) {
    filename = _.kebabCase(filename);
    browserObj.takeScreenshot().then(function(png) {
        var file = path.resolve(configOptions.destScreenShots + '/' + filename + '.png');
        fs.writeFileSync(file, png, {
            encoding: 'base64'
        });
    });
};

var mockGeoLocation = function() {
    window.angular.module('mockGeoLocation', [])
        .factory('$cordovaGeolocation', ['$q', function($q) {
            return {
                getCurrentPosition: function() {
                    var deferred = $q.defer();
                    deferred.resolve({
                        coords: {
                            latitude: 32.182,
                            longitude: 34.805
                        }
                    });
                    return deferred.promise;
                }
            };
        }]);
};

var disableNgAnimate = function() {
    window.angular.module('disableNgAnimate', [])
        .run(['$animate', function($animate) {
            $animate.enabled(false);
        }]);
};
var disableCssAnimate = function() {
    window.angular.module('disableCssAnimate', [])
        .run(function() {
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = '* {' +
                '-webkit-transition: none !important;' +
                '-moz-transition: none !important' +
                '-o-transition: none !important' +
                '-ms-transition: none !important' +
                'transition: none !important' +
                '}';
            document.getElementsByTagName('head')[0].appendChild(style);
        });
};

var addMockModules = function() {
    browserObj.addMockModule('disableNgAnimate', disableNgAnimate);
    browserObj.addMockModule('disableCssAnimate', disableCssAnimate);
    browserObj.addMockModule('mockGeoLocation', mockGeoLocation);
};

var swipe = function(el, distance) {
    browserObj.driver
        .actions()
        .mouseDown(el)
        .mouseMove({
            x: distance,
            y: 0
        })
        .mouseUp().perform();
};

var waitForUrlToChangeTo = function(urlRegex) {
    return browserObj.getCurrentUrl()
        .then(function(url) {})
        .then(function() {
            return browserObj.wait(function() {
                return browserObj.getCurrentUrl()
                    .then(function(url) {
                        return urlRegex.test(url);
                    });
            });
        });
};

var clearState = function() {
    browserObj.manage().deleteAllCookies();
    browserObj.executeScript('window.localStorage.clear();');
};

var getLogs = function() {
    return browserObj.manage().logs().get('browser');
};

var maximizeWindow = function() {
    setTimeout(function() {
        browserObj.driver.executeScript(function() {
            return {
                width: window.screen.availWidth,
                height: window.screen.availHeight
            };
        }).then(function(result) {
            browserObj.driver.manage().window().setSize(result.width, result.height);
        });
    });
};

var extendsBrowser = function(browser, config) {
    browserObj = browser;
    // save options
    configOptions = config;

    // add mock angular modules
    addMockModules();

    // add shot method for taking screenshot
    browserObj.shot = shot;

    browserObj.swipeLeft = function(el, distance) {
        swipe(el, distance || -50);
    };

    browserObj.swipeRight = function(el, distance) {
        swipe(el, distance || 50);
    };

    browserObj.waitForUrlToChangeTo = waitForUrlToChangeTo;
    browserObj.clearState = clearState;
    browserObj.getLogs = getLogs;
    browserObj.maximizeWindow = maximizeWindow;
};

module.exports = {
    extendsBrowser: extendsBrowser
};
