'use strict';

var angular = require('angular-mocks');
var app = require('../')('app');
var valuename = '<%= valuename %>';
describe(app.name, function() {

    describe('Values', function() {

        describe('<%= valuename %>', function() {

            beforeEach(function() {
                angular.mock.module(app.name);
            });

            beforeEach(inject(function($injector) {
                this.constant = $injector.get(app.name + '.' + valuename);

            }));

            it('should be defined', function() {
                expect(this.Ò).toBeDefined();
            });

        });
    });
});