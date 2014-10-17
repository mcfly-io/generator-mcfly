'use strict';

var angular = require('angular-mocks');
var app = require('../')('app');
describe(app.name, function() {

    describe('Directives', function() {

        describe('<%= directivename %>', function() {

            beforeEach(function() {
                angular.mock.module(app.name);
            });

            beforeEach(inject(function($injector) {
                this.$templateCache = $injector.get('$templateCache');
                this.$compile = $injector.get('$compile');
                this.$scope = $injector.get('$rootScope').$new();
                this.$scope.vm = {};
            }));

            it('should succeed', function() {
                var element = angular.element('<<%= htmlname %>></<%= htmlname %>>');
                this.$compile(element)(this.$scope);
                this.$scope.$digest();
                expect(element.html()).toBe('This is my directive : <%= htmlname %>');
            });

        });
    });
});