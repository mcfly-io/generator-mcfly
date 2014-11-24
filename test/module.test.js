'use strict';

var testHelper = require('./testHelper');
var _ = require('lodash');
var Q = require('q');
var utils = require('../utils');
var modulename = 'common';
var clientFolder = 'www';

describe('angular-famous-ionic:module', function() {

    describe('general test', function() {
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
                    generator.clientFolder = clientFolder;
                    generator.log = sinon.spy();

                    generator.mkdir(clientFolder + '/scripts/toto');
                    generator.mkdir(clientFolder + '/scripts/tata');

                });

        });

        it('creates files', function(done) {
            this.runGen.on('end', function() {
                var folder = clientFolder + '/scripts/' + modulename;
                var file = folder + '/index.js';
                assert.file([
                    file
                ]);
                done();
            });

        });

        it('module file should contain module name', function(done) {
            this.runGen.on('end', function() {
                var file = clientFolder + '/scripts/' + modulename + '/index.js';
                var body = testHelper.readTextFile(file);
                assert(_.contains(body, 'var modulename = \'' + modulename + '\';'));
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

    describe('when getClientModules fails', function() {

        it('should emit error when #getClientModules() fails', function(done) {
            testHelper.runGenerator('module')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompt({
                    modulename: modulename
                })
                .on('ready', function(generator) {
                    generator.clientFolder = clientFolder;
                    generator.log = sinon.spy();
                    generator.getClientModules = function() {

                        var deferred = Q.defer();
                        deferred.reject('an error occured');
                        return deferred.promise;
                    };
                })
                .on('error', function(err) {
                    assert.equal(err, 'No module found');
                    //done();
                })
                .on('end', function() {
                    done();
                });

        });
    });

    describe('angular modules', function() {

        it('should include angular-ionic with ionic', function(done) {
            testHelper.runGenerator('module')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompt({
                    modulename: modulename
                })
                .on('ready', function(generator) {
                    generator.clientFolder = clientFolder;
                    generator.log = sinon.spy();

                    generator.afterInitializing = function() {
                        generator.ionic = true;
                        generator.ngModules = utils.getNgModules(generator);

                    };
                    generator.mkdir(clientFolder + '/scripts/toto');
                    generator.mkdir(clientFolder + '/scripts/tata');
                })
                .on('end', function() {
                    var file = clientFolder + '/scripts/' + modulename + '/index.js';
                    var body = testHelper.readTextFile(file);
                    assert(_.contains(body, 'require(\'angular-ionic\');'));
                    assert(_.contains(body, '\'ionic\''));
                    done();
                });

        });

        it('should include famous-angular with famous', function(done) {
            testHelper.runGenerator('module')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompt({
                    modulename: modulename
                })
                .on('ready', function(generator) {
                    generator.clientFolder = clientFolder;
                    generator.log = sinon.spy();

                    generator.afterInitializing = function() {
                        generator.famous = true;
                        generator.ngModules = utils.getNgModules(generator);

                    };
                    generator.mkdir(clientFolder + '/scripts/toto');
                    generator.mkdir(clientFolder + '/scripts/tata');
                })
                .on('end', function() {
                    var file = clientFolder + '/scripts/' + modulename + '/index.js';
                    var body = testHelper.readTextFile(file);
                    assert(_.contains(body, 'require(\'famous-angular\');'));
                    assert(_.contains(body, '\'famous.angular\''));
                    done();
                });

        });

        it('should include ngCordova', function(done) {
            testHelper.runGenerator('module')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompt({
                    modulename: modulename
                })
                .on('ready', function(generator) {
                    generator.clientFolder = clientFolder;
                    generator.log = sinon.spy();

                    generator.afterInitializing = function() {
                        generator.ngCordova = true;
                        generator.ngModules = utils.getNgModules(generator);

                    };
                    generator.mkdir(clientFolder + '/scripts/toto');
                    generator.mkdir(clientFolder + '/scripts/tata');
                })
                .on('end', function() {
                    var file = clientFolder + '/scripts/' + modulename + '/index.js';
                    var body = testHelper.readTextFile(file);
                    assert(_.contains(body, 'require(\'ngCordova\');'));
                    done();
                });

        });

        it('should include famous-angular and angular-ionic with famous, ionic and ngCordova', function(done) {
            testHelper.runGenerator('module')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompt({
                    modulename: modulename
                })
                .on('ready', function(generator) {
                    generator.clientFolder = clientFolder;
                    generator.log = sinon.spy();

                    generator.afterInitializing = function() {
                        generator.famous = true;
                        generator.ionic = true;
                        generator.ngCordova = true;
                        generator.ngModules = utils.getNgModules(generator);

                    };
                    generator.mkdir(clientFolder + '/scripts/toto');
                    generator.mkdir(clientFolder + '/scripts/tata');
                })
                .on('end', function() {
                    var file = clientFolder + '/scripts/' + modulename + '/index.js';
                    var body = testHelper.readTextFile(file);

                    assert(_.contains(body, 'require(\'famous-angular\');'));
                    assert(_.contains(body, 'require(\'angular-ionic\');'));
                    assert(_.contains(body, 'require(\'ngCordova\');'));
                    assert(_.contains(body, '\'ionic\''));
                    assert(_.contains(body, '\'famous.angular\''));
                    done();
                });

        });

    });

});