'use strict';

var helpers = require('yeoman-generator').test;
var testHelper = require('./testHelper');

var modulename = 'common';
var servicename = 'myService';

describe('angular-famous-ionic:service', function() {
    before(function(done) {
        this.runGen = testHelper.runGenerator('service')
            .withOptions({
                'skip-install': true,
                'check-travis': false,
                'check-git': true
            })
            .withPrompt({
                modulename: modulename,
                servicename: servicename
            })
            .on('ready', function() {
                var spyLog = sinon.spy();
                helpers.stub(this.runGen.generator, 'log', spyLog);
                done();
            }.bind(this));

    });

    it('creates files', function(done) {
        this.runGen.on('end', function() {
            assert.file([
                'client/scripts/' + modulename + '/services/' + servicename + '.js'
            ]);
            done();
        });

    });
});