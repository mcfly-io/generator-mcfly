'use strict';

require('./polyfill');
var angular = require('angular');

var jQLite = exports.jQLite = angular.element;

var camelToDash = exports.camelToDash = function(str) {
    return str.replace(/\W+/g, '-')
        .replace(/([a-z\d])([A-Z])/g, '$1-$2');
};

exports.compileDirective = function(directivename, html, runDigest) {
    runDigest = runDigest === undefined ? true : runDigest;

    var element = jQLite(html);
    this.$compile(element)(this.$scope);
    if (runDigest) {
        this.$scope.$digest();
    }
    this.directive = element.find(camelToDash(directivename));
    if (this.directive.length === 0) {
        this.directive = element;
    }
    this.controller = this.directive.controller(directivename);
    this.scope = this.directive.isolateScope() || this.directive.scope();
    return element;
};

exports.compileDirectiveFamous = function(directivename, html, height) {
    height = height || 100;
    var element = jQLite('<fa-app style="height: ' + height + 'px">' + html + '</fa-app>');
    document.body.appendChild(element[0]);
    this.$compile(element)(this.$scope);
    this.$scope.$digest();
    this.directive = element.find(camelToDash(directivename));
    this.controller = this.directive.controller(directivename);
    this.scope = this.directive.isolateScope() || this.directive.scope();
    return element;
};

exports.cleanDocument = function() {
    var body = document.body;
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }
};

exports.mockEvent = function(eventData) {
    return new CustomEvent('mock', eventData || {});
};
