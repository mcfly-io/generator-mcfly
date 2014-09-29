'use strict';
var modulename = '<%= modulename %>';

module.exports = function(namespace) {

    var fullname = namespace + '.' + modulename;

    var angular = require('angular');
    var app = angular.module(fullname, []);

    require('./configs')(app);
    require('./constants')(app);
    require('./controllers')(app);
    require('./directives')(app);
    require('./filters')(app);
    require('./services')(app);
    require('./values')(app);

    return app;
};