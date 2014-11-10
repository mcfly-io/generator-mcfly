'use strict';

var testHelper = require('./testHelper');
var Q = require('q');
var _ = require('lodash');
var modulename = 'common';
var servicename = 'myService';
var clientFolder = 'www';

describe('angular-famous-ionic:service', function() {
    describe('with modules', function() {

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
                    generator.clientFolder = clientFolder;
                    generator.log = sinon.spy();

                    // create modules
                    generator.mkdir(clientFolder + '/scripts/toto');
                    generator.mkdir(clientFolder + '/scripts/tata');
                    generator.mkdir(clientFolder + '/scripts/common');

                    // create an index file for common
                    generator.ionic = true;
                    generator.famous = true;
                    generator.ngCordova = true;
                    generator.ngModules = [];
                    generator.template('../../templates/module/index.js', clientFolder + '/scripts/common/index.js');

                });

        });

        it('creates files', function(done) {
            this.runGen.on('end', function() {
                var folder = clientFolder + '/scripts/' + modulename + '/services';
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
                var folder = clientFolder + '/scripts/' + modulename + '/services';
                var file = folder + '/' + servicename + '.js';
                var body = testHelper.readTextFile(file);
                assert(_.contains(body, 'var servicename = \'' + servicename + '\';'));
                done();
            });
        });

        it('module should reference services folder', function(done) {
            this.runGen.on('end', function() {
                setTimeout(function() {
                    var folder = clientFolder + '/scripts/' + modulename;
                    var body = testHelper.readTextFile(folder + '/index.js');
                    assert(_.contains(body, 'require(\'./services\')(app);'));
                    done();
                }, 200);

            });
        });

        it('services/index.js should reference service file', function(done) {
            this.runGen.on('end', function() {
                setTimeout(function() {
                    var folder = clientFolder + '/scripts/' + modulename + '/services';
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

    describe('without modules', function() {

        it('should emit error when #getClientModules() fails', function(done) {
            var ctx = testHelper.runGenerator('service')
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
                    generator.clientFolder = clientFolder;
                    generator.log = sinon.spy();
                    generator.getClientModules = function() {
                        var deferred = Q.defer();
                        deferred.reject('an error occured');
                        return deferred.promise;
                    };
                })
                .on('error', function(err) {
                    assert(ctx.generator.log.calledOnce);
                    assert.equal(err, 'No module found');
                    //done();
                })
                .on('end', function() {
                    done();
                });
        });

        it('should emit error when no module', function(done) {
            var ctx = testHelper.runGenerator('service')
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
                    generator.clientFolder = clientFolder;
                    generator.log = sinon.spy();
                    generator.getClientModules = function() {
                        var deferred = Q.defer();
                        deferred.resolve([]);
                        return deferred.promise;
                    };
                })
                .on('error', function(err) {
                    assert(ctx.generator.log.calledOnce);
                    assert.equal(err, 'No module found');
                    //done();
                })
                .on('end', function() {
                    done();
                });
        });

    });

    it('with invalid servicetype option should throw an error', function(done) {

        var ctx = testHelper.runGenerator('service')
            .withOptions({
                'skip-install': true,
                'check-travis': false,
                'check-git': true,
                'servicetype': 'dummy'
            })
            .withPrompt({
                modulename: modulename,
                servicename: servicename
            })
            .on('ready', function(generator) {
                generator.clientFolder = clientFolder;
                generator.log = sinon.spy();
                generator.getClientModules = function() {
                    var deferred = Q.defer();
                    deferred.resolve(['common']);
                    return deferred.promise;
                };
            })
            .on('error', function(err) {
                assert(ctx.generator.log.calledOnce);
                assert.equal(err, 'Invalid service type');
                //done();
            })
            .on('end', function() {

                done();
            });
    });

});