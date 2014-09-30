'use strict';

require('angular-mocks');
var app = require('../')('app');
var controllername = '<%= controllername %>';
describe(app.name, function() {

    describe('Controllers', function() {

        describe('<%= controllername %>', function() {

            beforeEach(function() {
                angular.mock.module(app.name);
            });

            beforeEach(inject(function($injector) {
                this.$controller = $injector.get('$controller');
                this.$scope = $injector.get('$rootScope').$new();
                this.controller = this.$controller(app.name + '.' + controllername + ' as vm', {
                    '$scope': this.$scope
                });
            }));

            it('controller should be defined', function() {
                expect(this.controller).toBeDefined();
            });
            
        });
    });
});