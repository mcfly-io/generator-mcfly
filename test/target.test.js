'use strict';

var testHelper = require('./testHelper');
var _ = require('lodash');
var Q = require('q');
var targetname = 'web';
var suffix = '-' + targetname;
var clientFolder = 'www';

describe('angular-famous-ionic:target', function() {

    describe('general test', function() {
        beforeEach(function() {
            this.runGen = testHelper.runGenerator('target')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompt({
                    targetname: targetname
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
                var folder = clientFolder;
                assert.file([
                    folder + '/index' + suffix + '.html',
                    folder + '/scripts/main' + suffix + '.js',
                    folder + '/scripts/main' + suffix + '.test.js',
                    folder + '/styles/main' + suffix + '.scss'
                ]);
                done();
            });

        });

        it('index file should contain target name', function(done) {
            this.runGen.on('end', function() {
                var file = clientFolder + '/index' + suffix + '.html';
                var body = testHelper.readTextFile(file);
                assert(_.contains(body, 'styles/main' + suffix + '.css'));
                assert(_.contains(body, 'scripts/bundle' + suffix + '.js'));
                done();
            });
        });

        it('with empty target name should throw an error', function(done) {
            this.runGen
                .withPrompt({
                    targetname: ''
                })
                .on('end', function() {
                    assert(_.isEqual(this.runGen.generator.prompt.errors, [{
                        name: 'targetname',
                        message: 'Please enter a non empty name'
                    }]));
                    done();
                }.bind(this));
        });

        it('with passing existing targetname should throw an error', function(done) {
            this.runGen
                .withPrompt({
                    targetname: 'toto'
                })
                .on('ready', function(generator) {
                    generator.getClientTargets = function() {
                        return Q.when(['toto']);
                    };
                })
                .on('error', function(err) {
                    assert(err instanceof Error);
                    done();
                });
        });

        it('with prompting existing targetname should throw an error', function(done) {
            this.runGen
                .withPrompt({
                    targetname: 'toto'
                })
                .on('ready', function(generator) {
                    generator.getClientTargets = function() {
                        return Q.when(['toto']);
                    };
                })
                .on('error', function() {
                    assert(_.isEqual(this.runGen.generator.prompt.errors, [{
                        name: 'targetname',
                        message: 'The target name toto already exists'
                    }]));
                    done();
                }.bind(this));
        });

        it('with new targetname should succeed', function(done) {
            this.runGen
                .withPrompt({
                    targetname: 'dummy'
                })
                .on('end', function() {
                    assert(_.isEqual(this.runGen.generator.prompt.errors, undefined));
                    done();
                }.bind(this));
        });

        it('with new targetname app should scaffold index.html', function(done) {
            this.runGen
                .withPrompt({
                    targetname: 'app'
                })
                .on('end', function() {
                    var folder = clientFolder;
                    assert.file([
                        folder + '/index' + '.html',
                        folder + '/scripts/main' + '.js',
                        folder + '/scripts/main' + '.test.js',
                        folder + '/styles/main' + '.scss'
                    ]);
                    done();
                });
        });

        it('with argument targetname should not prompt', function(done) {
            this.runGen
                .withArguments([targetname])
                .on('end', function() {
                    assert.equal(this.runGen.generator.targetname, targetname);
                    assert.equal(this.runGen.generator.prompt.errors, undefined);
                    done();
                }.bind(this));
        });
    });

    describe('when getClientTargets fails', function() {

        it('should emit error when #getClientTargets() fails', function(done) {
            testHelper.runGenerator('target')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompt({
                    targetname: targetname
                })
                .on('ready', function(generator) {
                    generator.clientFolder = clientFolder;
                    generator.log = sinon.spy();
                    generator.getClientTargets = function() {

                        var deferred = Q.defer();
                        deferred.reject('an error occured');
                        return deferred.promise;

                    };
                })
                .on('error', function(err) {
                    assert.equal(err, 'No target found');
                    //done();
                })
                .on('end', function() {
                    done();
                });

        });
    });

});