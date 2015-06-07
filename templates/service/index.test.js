'use strict';
/*eslint consistent-this:[0] */
var angular = require('angular');
require('angular-mocks');
var app = require('../')('app');
var servicename = '<%= servicename %>';
describe(app.name, function() {

    describe('Services', function() {

        describe(servicename, function() {

            beforeEach(function() {
                angular.mock.module(app.name);
            });
<% if(servicetype === 'provider') { %>
            beforeEach(angular.mock.module([app.name + '.' + servicename + 'Provider', function(serviceNameProvider) {
                // Configure the provider
                serviceNameProvider.init();
            }]));
<% } %>
            beforeEach(inject(function($injector) {
                this.service = $injector.get(app.name + '.' + servicename);
            }));

            it('should be defined', function() {
                expect(this.service).toBeDefined();
            });
<% if(servicetype === 'provider') { %>
            it('should be initialized', function() {
                expect(this.service.isInitialized).toBe(true);
            });
<% } %>
        });
    });
});