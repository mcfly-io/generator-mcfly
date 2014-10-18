'use strict';

var angular = require('angular-mocks');
var app = require('../')('app');
var filtername = '<%= filtername %>';
describe(app.name, function() {

    describe('Filters', function() {

        describe('<%= filtername %>', function() {

            beforeEach(function() {
                angular.mock.module(app.name);
            });

            beforeEach(inject(function($injector) {
                this.$filter = $injector.get('$filter');
                this.filter = this.$filter(filtername);
            }));

            it('should be defined', function() {
                expect(this.filter).toBeDefined();
            });

            it('should be defined', function() {
                var text = 'This Is My Text';
                expect(this.filter(text)).toBe(text.toLowerCase());
            });
        });
    });
});