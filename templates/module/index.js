'use strict';
<% if (ionic) { %>
require('angular-ionic');
<% } %>
var modulename = '<%= modulename %>';

module.exports = function(namespace) {

    var fullname = namespace + '.' + modulename;

    var angular = require('angular');
    var app = angular.module(fullname, [<% if(ionic) { %>'ionic'<% } %>]);
    // inject:folders start
    // inject:folders end
    return app;
};