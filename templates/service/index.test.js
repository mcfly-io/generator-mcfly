require('angular-mocks');
var app = require('../')('app');
var serviceName = '<%= servicename %>';
describe(app.name, function() {

    describe('Services', function() {

        describe(serviceName, function() {

            beforeEach(function() {
                angular.mock.module(app.name);
            });

            beforeEach(inject(function($injector) {
                this.service = $injector.get(app.name + '.' + serviceName);
            }));

            it("should_be_defined", function() {
                expect(this.service).toBeDefined();
            });

        });
    });
});