'use strict';
<% if (ionic) { %>require('angular-ionic');<% } %>
<% if (famous) { %>require('famous-angular');<% } %>

var modulename = '<%= modulename %>';

module.exports = function(namespace) {

    var fullname = namespace + '.' + modulename;

    var angular = require('angular');
    var app = angular.module(fullname, [<%= ngModules %>]);
    // inject:folders start
    // inject:folders end
    return app;
};