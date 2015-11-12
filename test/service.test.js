'use strict';

global.Promise = require('bluebird');
var testHelper = require('./testHelper');
var _ = require('lodash');
var modulename = 'common';
var servicename = 'myService';
var clientFolder = 'www';

require('./helpers/globals');

describe('generator:service', function() {
    describe('with modules', function() {
        beforeEach(function(done) {
            this.runGen = testHelper.runGenerator('service')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompts({
                    modulename: modulename,
                    servicename: servicename
                })
                .on('ready', function(generator) {
                    generator.clientFolder = clientFolder;
                    generator.log = sinon.spy();
                    // create modules
                    generator.utils.mkdir(clientFolder + '/scripts/toto');
                    generator.utils.mkdir(clientFolder + '/scripts/tata');
                    generator.utils.mkdir(clientFolder + '/scripts/common');

                    // set options
                    testHelper.setOptions(generator);

                    // create an index file for common
                    generator.template('../../templates/module/index.js', clientFolder + '/scripts/common/index.js');
                    done();
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

        xit('with empty servicename should throw an error', function(done) {
            this.runGen
                .withPrompts({
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

        xit('with empty modulename should throw an error', function(done) {
            this.runGen
                .withPrompts({
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

        xit('with unknown modulename should throw an error', function(done) {
            var missingModulename = 'dummy';
            this.runGen
                .withPrompts({
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
                .withPrompts({
                    modulename: modulename,
                    servicename: servicename
                })
                .on('ready', function(generator) {
                    generator.clientFolder = clientFolder;
                    generator.log = sinon.spy();
                    generator.getClientModules = function() {
                        return new Promise(function(resolve, reject) {
                            reject('an error occured');
                        });
                    };
                })
                .on('error', function(err) {
                    assert(ctx.generator.log.calledOnce);
                    assert.equal(err, 'No module found');
                })
                .on('end', done);
        });

        it('should emit error when no module', function(done) {
            var ctx = testHelper.runGenerator('service')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompts({
                    modulename: modulename,
                    servicename: servicename
                })
                .on('ready', function(generator) {
                    generator.clientFolder = clientFolder;
                    generator.log = sinon.spy();
                    generator.getClientModules = function() {
                        return new Promise(function(resolve, reject) {
                            resolve([]);
                        });
                    };
                })
                .on('error', function(err) {
                    assert(ctx.generator.log.calledOnce);
                    assert.equal(err, 'No module found');
                })
                .on('end', done);
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
            .withPrompts({
                modulename: modulename,
                servicename: servicename
            })
            .on('ready', function(generator) {
                generator.clientFolder = clientFolder;
                generator.log = sinon.spy();
                generator.getClientModules = function() {
                    return new Promise(function(resolve, reject) {
                        resolve(['common']);
                    });
                };
            })
            .on('error', function(err) {
                assert(ctx.generator.log.calledOnce);
                assert.equal(err, 'Invalid service type');
            })
            .on('end', done);
    });

    describe('with snake-case', function() {
        beforeEach(function(done) {
            this.runGen = testHelper.runGenerator('service')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompts({
                    modulename: modulename,
                    servicename: servicename
                })
                .on('ready', function(generator) {
                    generator.clientFolder = clientFolder;
                    generator.log = sinon.spy();

                    this.configGet = sinon.stub();
                    this.configGet.withArgs('filenameCase').returns('snake');
                    generator.config.get = this.configGet;
                    // create modules
                    generator.utils.mkdir(clientFolder + '/scripts/toto');
                    generator.utils.mkdir(clientFolder + '/scripts/tata');
                    generator.utils.mkdir(clientFolder + '/scripts/common');

                    // set options
                    testHelper.setOptions(generator);

                    // create an index file for common
                    generator.template('../../templates/module/index.js', clientFolder + '/scripts/common/index.js');
                    done();
                }.bind(this));

        });

        it('creates files with correct case', function(done) {
            this.runGen.on('end', function() {
                var folder = clientFolder + '/scripts/' + modulename + '/services';
                var filename = _.snakeCase(servicename);
                var file = folder + '/' + filename + '.js';
                var filetest = folder + '/' + filename + '.test.js';
                assert.file([
                    file,
                    filetest
                ]);

                assert(this.configGet.calledWith('filenameCase'));
                done();
            }.bind(this));

        });

    });

    describe('with type suffix', function() {
        beforeEach(function(done) {
            this.runGen = testHelper.runGenerator('service')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompts({
                    modulename: modulename,
                    servicename: servicename
                })
                .on('ready', function(generator) {
                    generator.clientFolder = clientFolder;
                    generator.log = sinon.spy();

                    this.configGet = sinon.stub();
                    this.configGet.withArgs('filenameSuffix').returns(true);
                    generator.config.get = this.configGet;
                    // create modules
                    generator.utils.mkdir(clientFolder + '/scripts/toto');
                    generator.utils.mkdir(clientFolder + '/scripts/tata');
                    generator.utils.mkdir(clientFolder + '/scripts/common');

                    // set options
                    testHelper.setOptions(generator);

                    // create an index file for common
                    generator.template('../../templates/module/index.js', clientFolder + '/scripts/common/index.js');
                    done();
                }.bind(this));

        });

        it('creates files with correct case', function(done) {
            this.runGen.on('end', function() {
                var folder = clientFolder + '/scripts/' + modulename + '/services';
                var filename = servicename + '.service';
                var file = folder + '/' + filename + '.js';
                var filetest = folder + '/' + filename + '.test.js';
                assert.file([
                    file,
                    filetest
                ]);

                assert(this.configGet.calledWith('filenameSuffix'));
                done();
            }.bind(this));

        });

    });

});
