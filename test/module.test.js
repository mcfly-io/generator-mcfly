'use strict';

var helpers = require('yeoman-generator').test;
var testHelper = require('./testHelper');
var _ = require('lodash');

var modulename = 'common';

describe('angular-famous-ionic:module', function() {
    beforeEach(function() {
        this.runGen = testHelper.runGenerator('module')
            .withOptions({
                'skip-install': true,
                'check-travis': false,
                'check-git': true
            })
            .withPrompt({
                modulename: modulename
            })
            .on('ready', function() {

                this.runGen.generator.mkdir('client/scripts/toto');
                this.runGen.generator.mkdir('client/scripts/tata');
                this.runGen.generator.mkdir('client/scripts/common');

                var spyLog = sinon.spy();
                helpers.stub(this.runGen.generator, 'log', spyLog);
            }.bind(this));

    });

    it('creates files', function(done) {
        this.runGen.on('end', function() {
            assert.file([
                'client/scripts/' + modulename + '/index.js'
            ]);
            done();
        });

    });

    it('with empty modulename should throw an error', function(done) {
        this.runGen
            .withPrompt({
                modulename: ''
            })
            .on('end', function() {
                assert(_.isEqual(this.runGen.generator.prompt.errors, [{
                    name: 'modulename',
                    message: 'Please enter a non empty name'
                }]));
                done();
            }.bind(this));
    });

    it('with existing modulename should throw an error', function(done) {
        this.runGen
            .withPrompt({
                modulename: modulename
            })
            .on('end', function() {
                assert(_.isEqual(this.runGen.generator.prompt.errors, [{
                    name: 'modulename',
                    message: 'The module name ' + modulename + ' already exists'
                }]));
                done();
            }.bind(this));
    });

    it('with new modulename should throw an error', function(done) {
        this.runGen
            .withPrompt({
                modulename: 'dummy'
            })
            .on('end', function() {
                assert(_.isEqual(this.runGen.generator.prompt.errors, undefined));
                done();
            }.bind(this));
    });

    it('with argument modulename and servicename should not prompt', function(done) {
        this.runGen
            .withArguments([modulename])
            .on('end', function() {
                assert.equal(this.runGen.generator.modulename, modulename);
                assert.equal(this.runGen.generator.prompt.errors, undefined);
                done();
            }.bind(this));
    });
});