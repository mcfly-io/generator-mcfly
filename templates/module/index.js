'use strict';
var moduleName = '<%= this.modulename %>';

module.exports = function (namespace) {

	var fullname = namespace + '.' + moduleName;

	var angular = require('angular');
	var app = angular.module(fullname, []);

	require('./controllers')(app);
	require('./directives')(app);
	return app;
};