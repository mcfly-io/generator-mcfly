'use strict';
var angular = require('angular');
require('angular-ui-router');<% if (ionic) { %>
require('angular-sanitize');
require('angular-animate');
require('ionic');
require('ionic-angular');<% } %><% if (material) { %>
require('angular-material');<% } %><% if (famous) { %>
require('famous-angular');<% } %><% if (ngCordova) { %>
require('ng-cordova');<% } %><% if (bootstrap) { %>
require('angular-ui-bootstrap');<% } %>

var modulename = '<%= modulename %>';

module.exports = function(namespace) {

    var fullname = namespace + '.' + modulename;

    var app = angular.module(fullname, ['ui.router', <%- ngModules %>]);
    // inject:folders start
    // inject:folders end
    app.namespace = app.namespace || {};
<% if (!skipRoute) { %>
    var configRoutesDeps = ['$stateProvider', '$urlRouterProvider'];
    var configRoutes = function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider.state('home', {
            url: '/',
            template: require('./views/home.html')
        });
    };
    configRoutes.$inject = configRoutesDeps;
    app.config(configRoutes);
<% } %>
    return app;
};