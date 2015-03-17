'use strict';

var testHelper = require('./testHelper');
var Q = require('q');
var _ = require('lodash');
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
                    folder + '/styles/main' + suffix + '.scss',
                    folder + '/images/' + targetname,
                    folder + '/icons/' + targetname,
                    folder + '/fonts/' + targetname,
                    folder + '/404' + suffix + '.html',
                    folder + '/robots' + suffix + '.txt',
                    folder + '/favicon' + suffix + '.ico'
                ]);
                done();
            });

        });

        it('index file should not contain target name', function(done) {
            this.runGen.on('end', function() {
                var file = clientFolder + '/index' + suffix + '.html';
                var body = testHelper.readTextFile(file);
                assert(_.contains(body, 'styles/main' + '.css'));
                assert(_.contains(body, 'scripts/bundle' + '.js'));
                done();
            });
        });

        it('should inject modules in target file', function(done) {

            this.runGen
                .on('ready', function(generator) {
                    var end = Object.getPrototypeOf(generator).end;

                    Object.getPrototypeOf(generator).end = function() {

                        return end.apply(generator).then(function() {
                            [suffix].forEach(function(suffix) {

                                var file = clientFolder + '/scripts/main' + suffix + '.js';
                                var body = testHelper.readTextFile(file);
                                assert(_.contains(body, 'require(\'./tata\')(namespace).name'));
                                assert(_.contains(body, 'require(\'./toto\')(namespace).name'));
                            });
                            done();
                        });

                    };

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

                })
                .on('end', done);
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
                }.bind(this))
                .on('end', done);
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
                })
                .on('end', done);

        });
    });

    describe('with option mobile', function() {
        beforeEach(function() {
            this.runGen = testHelper.runGenerator('target')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true,
                    'mobile': true
                })
                .withPrompt({
                    targetname: targetname
                })
                .on('ready', function(generator) {
                    generator.appname = 'myapp';
                    generator.clientFolder = clientFolder;
                    generator.log = sinon.spy();
                    generator.mkdir(clientFolder + '/scripts/toto');
                    generator.mkdir(clientFolder + '/scripts/tata');

                });

        });

        it('creates cordova config.xml', function(done) {
            this.runGen.on('end', function() {
                var folder = clientFolder;
                assert.file([
                    folder + '/config' + suffix + '.xml'
                ]);

                done();
            });
        });

        it('creates cordova hooks', function(done) {
            this.runGen.on('end', function() {
                var folder = clientFolder;
                assert.file([
                    folder + '/cordova/' + targetname + '/hooks' + '/after_platform_add/010_install_plugins.js',
                    folder + '/cordova/' + targetname + '/hooks' + '/after_prepare/010_add_platform_class.js'
                ]);

                done();
            });
        });

        it('references cordova.js in index.html', function(done) {
            this.runGen.on('end', function() {
                var file = clientFolder + '/index' + suffix + '.html';
                var body = testHelper.readTextFile(file);
                assert(_.contains(body, 'cordova.js'));

                done();
            });
        });
    });

});
