'use strict';
var moduleName = '<%= modulename %>';

module.exports = function(namespace) {

    var fullname = namespace + '.' + moduleName;

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