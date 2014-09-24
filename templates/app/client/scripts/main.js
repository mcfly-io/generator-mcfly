'use strict';

var namespace = 'main';

require('angular');

var app = angular.module(namespace, [
    require('./common')(namespace).name
]);

module.exports = app;