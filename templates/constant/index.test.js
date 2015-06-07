'use strict';
/*eslint consistent-this:[0] */
var angular = require('angular');
require('angular-mocks');
var app = require('../')('app');
var constantname = '<%= constantname %>';
describe(app.name, function() {

    describe('Constants', function() {

        describe(constantname, function() {

            beforeEach(function() {
                angular.mock.module(app.name);
            });

            beforeEach(inject(function($injector) {
                this.constant = $injector.get(app.name + '.' + constantname);
            }));

            it('should be defined', function() {
                expect(this.constant).toBeDefined();
            });

        });
    });
});