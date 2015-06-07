'use strict';
/*eslint consistent-this:[0] */
var angular = require('angular');
require('angular-mocks');
var app = require('../')('app');
var valuename = '<%= valuename %>';
describe(app.name, function() {

    describe('Values', function() {

        describe(valuename, function() {

            beforeEach(function() {
                angular.mock.module(app.name);
            });

            beforeEach(inject(function($injector) {
                this.value = $injector.get(app.name + '.' + valuename);
            }));

            it('should be defined', function() {
                expect(this.value).toBeDefined();
            });

        });
    });
});