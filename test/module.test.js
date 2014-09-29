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
            .on('ready', function(generator) {
                generator.mkdir('client/scripts/toto');
                generator.mkdir('client/scripts/tata');

                var spyLog = sinon.spy();
                helpers.stub(generator, 'log', spyLog);
            });

    });

    it('creates files', function(done) {
        this.runGen.on('end', function() {
            var folder = 'client/scripts/' + modulename;
            var file = folder + '/index.js';
            assert.file([
                file,
                folder + '/configs/index.js',
                folder + '/constants/index.js',
                folder + '/controllers/index.js',
                folder + '/directives/index.js',
                folder + '/filters/index.js',
                folder + '/services/index.js',
                folder + '/values/index.js'
            ]);
            done();
        });

    });

    it('module file should contain module name', function(done) {
        this.runGen.on('end', function() {
            var file = 'client/scripts/' + modulename + '/index.js';
            var body = testHelper.readTextFile(file);
            assert(_.contains(body, 'var moduleName = \'' + modulename + '\';'));
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

    it('with passing existing modulename should throw an error', function(done) {
        this.runGen
            .withPrompt({
                modulename: 'toto'
            })
            .on('error', function(err) {
                assert(err instanceof Error);
                done();
            });
    });

    it('with prompting existing modulename should throw an error', function(done) {
        this.runGen
            .withPrompt({
                modulename: 'toto'
            })
            .on('error', function() {
                assert(_.isEqual(this.runGen.generator.prompt.errors, [{
                    name: 'modulename',
                    message: 'The module name toto already exists'
                }]));
                done();
            }.bind(this));
    });

    it('with new modulename should succeed', function(done) {
        this.runGen
            .withPrompt({
                modulename: 'dummy'
            })
            .on('end', function() {
                assert(_.isEqual(this.runGen.generator.prompt.errors, undefined));
                done();
            }.bind(this));
    });

    it('with argument modulename should not prompt', function(done) {
        this.runGen
            .withArguments([modulename])
            .on('end', function() {
                assert.equal(this.runGen.generator.modulename, modulename);
                assert.equal(this.runGen.generator.prompt.errors, undefined);
                done();
            }.bind(this));
    });
});