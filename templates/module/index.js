'use strict';
var modulename = '<%= modulename %>';

module.exports = function(namespace) {

    var fullname = namespace + '.' + modulename;

    var angular = require('angular');
    var app = angular.module(fullname, []);
    // inject:folders start

    // inject:folders end
    return app;
};