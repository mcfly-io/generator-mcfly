'use strict';

var namespace = 'main';

var angular = require('angular');
<% if (ionic) { %>require('angular-ionic');<% } %>
var app = angular.module(namespace, [<% if (ionic) { %>'ionic'<% } %>
    // inject:modules start
    // inject:modules end
]);
<% if (ionic) { %>
var runDeps = ['$ionicPlatform', '$window'];
var run = function($ionicPlatform, $window) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if($window.cordova && $window.cordova.plugins.Keyboard) {
            $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if($window.StatusBar) {
            $window.StatusBar.styleDefault();
        }
    });
};
<% } else { %>
var runDeps = [];
var run = function() {
};
<% } %>
run.$inject = runDeps;
app.run(run);

module.exports = app;