'use strict';

require('./polyfill');
var angular = require('angular');

var jQLite = exports.jQLite = angular.element;

var camelToDash = exports.camelToDash = function(str) {
    return str.replace(/\W+/g, '-')
        .replace(/([a-z\d])([A-Z])/g, '$1-$2');
};

exports.compileDirective = function(directivename, html) {
    var element = jQLite(html);
    this.$compile(element)(this.$scope);
    this.$scope.$digest();
    this.controller = element.controller(directivename);
    this.scope = element.isolateScope() || element.scope();
    return element;
};

exports.compileDirectiveFamous = function(directivename, html, height) {

    height = height || 100;

    var element = jQLite('<fa-app style="height: ' + height + 'px">' + html + '</fa-app>');
    var app = this.$compile(element)(this.$scope)[0];
    this.directive = element.find(camelToDash(directivename));
    this.controller = this.directive.controller(directivename);
    this.scope = this.directive.isolateScope() || this.directive.scope();
    document.body.appendChild(app);
    this.$scope.$digest();
    return element;
};

exports.cleanDocument = function() {
    var body = document.body;
    while(body.firstChild) {
        body.removeChild(body.firstChild);
    }
};

exports.mockEvent = function(eventData) {
    return new CustomEvent('mock', eventData || {});
};
