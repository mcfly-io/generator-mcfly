'use strict';

var helpers = require('yeoman-generator').test;
var testHelper = require('./testHelper');
var _ = require('lodash');
var modulename = 'common';
var servicename = 'myService';

describe('angular-famous-ionic:service', function() {
    beforeEach(function() {
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
            .on('ready', function(generator) {
                // create modules
                generator.mkdir('client/scripts/toto');
                generator.mkdir('client/scripts/tata');
                generator.mkdir('client/scripts/common');

                // create an index file for common/services
                //generator.template('../../templates/module/services/index.js', 'client/scripts/common/services/index.js');

                var spyLog = sinon.spy();
                helpers.stub(generator, 'log', spyLog);

            });

    });

    it('creates files', function(done) {
        this.runGen.on('end', function() {
            var folder = 'client/scripts/' + modulename + '/services';
            var file = folder + '/' + servicename + '.js';
            var filetest = folder + '/' + servicename + '.test.js';
            assert.file([
                file,
                filetest
            ]);

            done();
        });

    });

    it('service file should contain service name', function(done) {
        this.runGen.on('end', function() {
            var folder = 'client/scripts/' + modulename + '/services';
            var file = folder + '/' + servicename + '.js';
            var body = testHelper.readTextFile(file);
            assert(_.contains(body, 'var servicename = \'' + servicename + '\';'));
            done();
        });
    });

    it('services/index.js should reference service file', function(done) {
        this.runGen.on('end', function() {
            setTimeout(function() {
                var folder = 'client/scripts/' + modulename + '/services';
                var body = testHelper.readTextFile(folder + '/index.js');
                assert(_.contains(body, 'require(\'./' + servicename + '\')(app);'));
                done();
            }, 200);

        });
    });

    it('#getClientModules() should succeed', function(done) {
        this.runGen.on('end', function() {
            this.runGen.generator.getClientModules()
                .then(function(modules) {
                    assert(_.isEqual(modules, ['common', 'tata', 'toto']));
                    done();
                });
        }.bind(this));
    });

    it('with empty servicename should throw an error', function(done) {
        this.runGen
            .withPrompt({
                modulename: modulename,
                servicename: ''
            })
            .on('end', function() {
                assert(_.isEqual(this.runGen.generator.prompt.errors, [{
                    name: 'servicename',
                    message: 'Please enter a non empty name'
                }]));
                done();
            }.bind(this));
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

    it('with unknown modulename should throw an error', function(done) {
        var missingModulename = 'dummy';
        this.runGen
            .withPrompt({
                modulename: missingModulename
            })
            .on('end', function() {
                assert(_.isEqual(this.runGen.generator.prompt.errors, [{
                    name: 'modulename',
                    message: 'The module name ' + missingModulename + ' does not exist'
                }]));
                done();
            }.bind(this));
    });

    it('with argument modulename and servicename should not prompt', function(done) {
        this.runGen
            .withArguments([modulename, servicename])
            .on('end', function() {
                assert.equal(this.runGen.generator.modulename, modulename);
                assert.equal(this.runGen.generator.servicename, servicename);
                assert.equal(this.runGen.generator.prompt.errors, undefined);
                done();
            }.bind(this));
    });

});