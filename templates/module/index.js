'use strict';
require('angular-ui-router');
<% if (ionic) { %>require('angular-ionic');<% } %>
<% if (famous) { %>require('famous-angular');<% } %>
<% if (ngCordova) { %>require('ngCordova');<% } %>

var modulename = '<%= modulename %>';

module.exports = function(namespace) {

    var fullname = namespace + '.' + modulename;

    var angular = require('angular');
    var app = angular.module(fullname, ['ui.router', <%= ngModules %>]);
    // inject:folders start
    // inject:folders end
    app.config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
            $stateProvider.state('home', {
                url: '/',
                template: require('./views/home.html')
            });
        }
    ]);
    return app;
};