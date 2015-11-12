'use strict';

var namespace = 'main';
// fix protractor issue
if (window.location.toString().indexOf('localhost:5555') > 0) {
    window.name = 'NG_DEFER_BOOTSTRAP!NG_ENABLE_DEBUG_INFO!';
}
var angular = require('angular');
require('angular-ui-router');<% if (ionic) { %>
require('angular-animate');
require('angular-sanitize');
require('ionic');
require('ionic-angular');<% } %>
<% if (mobile) { %>// require('<%= ionicBundle %>');
<% } %><% if (material) { %>require('angular-material');<% } %><% if (bootstrap) { %>
require('angular-ui-bootstrap');<% } %>
var app = angular.module(namespace, [<% if (ionic) { %>'ionic',<% } %><% if (material) { %> 'ngMaterial',<% } %><% if (bootstrap) { %> 'ui.bootstrap',<% } %>
<% if (mobile) { %>    // 'ionic.service.core',
<% } %>    // inject:modules start
    // inject:modules end
]);

if (process.env.SENTRY_MODE === 'prod') {
    var configCompileDeps = ['$compileProvider'];
    var configCompile = function($compileProvider) {
        $compileProvider.debugInfoEnabled(false);
    };
    configCompile.$inject = configCompileDeps;
    app.config(configCompile);
}
<% if (ionic) { %>
var runDeps = ['$ionicPlatform', '$window'];
var run = function($ionicPlatform, $window) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if ($window.cordova && $window.cordova.plugins.Keyboard) {
            $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if ($window.StatusBar) {
            $window.StatusBar.styleDefault();
        }
        if ($window.TestFairy) {
            $window.TestFairy.begin(process.env.TESTFAIRY_IOS_APP_TOKEN);
        }
    });
};
<% } else if (mobile && !ionic) { %>
var runDeps = ['$window'];
var run = function($window) {
    document.addEventListener('deviceready', function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if ($window.cordova && $window.cordova.plugins.Keyboard) {
            $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if ($window.StatusBar) {
            $window.StatusBar.styleDefault();
        }
        if ($window.TestFairy) {
            $window.TestFairy.begin(process.env.TESTFAIRY_IOS_APP_TOKEN);
        }
    }, false);
};
<% } else { %>
var runDeps = [];
var run = function() {
};
<% } %>
run.$inject = runDeps;
app.run(run);

module.exports = app;