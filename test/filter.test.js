'use strict';

global.Promise = require('bluebird');
var testHelper = require('./testHelper');
var _ = require('lodash');
var modulename = 'common';
var filtername = 'myFilter';
var clientFolder = 'www';

require('./helpers/globals');

describe('generator:filter', function() {
    describe('with modules', function() {
        beforeEach(function() {
            this.runGen = testHelper.runGenerator('filter')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompts({
                    modulename: modulename,
                    filtername: filtername
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

                });

        });

        it('creates files', function(done) {
            this.runGen.on('end', function() {
                var folder = clientFolder + '/scripts/' + modulename + '/filters';
                var file = folder + '/' + filtername + '.js';
                var filetest = folder + '/' + filtername + '.test.js';
                assert.file([
                    file,
                    filetest
                ]);

                done();
            });

        });

        it('filter file should contain filter name', function(done) {
            this.runGen.on('end', function() {
                var folder = clientFolder + '/scripts/' + modulename + '/filters';
                var file = folder + '/' + filtername + '.js';
                var body = testHelper.readTextFile(file);
                assert(_.contains(body, 'var filtername = \'' + filtername + '\';'));
                done();
            });
        });

        it('module should reference filters folder', function(done) {
            this.runGen.on('end', function() {
                setTimeout(function() {
                    var folder = clientFolder + '/scripts/' + modulename;
                    var body = testHelper.readTextFile(folder + '/index.js');
                    assert(_.contains(body, 'require(\'./filters\')(app);'));
                    done();
                }, 200);

            });
        });

        it('filters/index.js should reference filter file', function(done) {
            this.runGen.on('end', function() {
                setTimeout(function() {
                    var folder = clientFolder + '/scripts/' + modulename + '/filters';
                    var body = testHelper.readTextFile(folder + '/index.js');
                    assert(_.contains(body, 'require(\'./' + filtername + '\')(app);'));
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

        xit('with empty filtername should throw an error', function(done) {
            this.runGen
                .withPrompts({
                    modulename: modulename,
                    filtername: ''
                })
                .on('end', function() {
                    assert(_.isEqual(this.runGen.generator.prompt.errors, [{
                        name: 'filtername',
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

        it('with argument modulename and filtername should not prompt', function(done) {
            this.runGen
                .withArguments([modulename, filtername])
                .on('end', function() {
                    assert.equal(this.runGen.generator.modulename, modulename);
                    assert.equal(this.runGen.generator.filtername, filtername);
                    assert.equal(this.runGen.generator.prompt.errors, undefined);
                    done();
                }.bind(this));
        });

    });

    describe('without modules', function() {

        it('should emit error when #getClientModules() fails', function(done) {
            var ctx = testHelper.runGenerator('filter')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompts({
                    modulename: modulename,
                    filtername: filtername
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
            var ctx = testHelper.runGenerator('filter')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompts({
                    modulename: modulename,
                    filtername: filtername
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
    describe('with snake-case', function() {
        beforeEach(function() {
            this.runGen = testHelper.runGenerator('filter')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompts({
                    modulename: modulename,
                    filtername: filtername
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

                }.bind(this));

        });

        it('creates files with correct case', function(done) {
            this.runGen.on('end', function() {
                var folder = clientFolder + '/scripts/' + modulename + '/filters';
                var filename = _.snakeCase(filtername);
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
    describe('with type suffixes', function() {
        beforeEach(function() {
            this.runGen = testHelper.runGenerator('filter')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompts({
                    modulename: modulename,
                    filtername: filtername
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

                }.bind(this));

        });

        it('creates files with correct suffix', function(done) {
            this.runGen.on('end', function() {
                var folder = clientFolder + '/scripts/' + modulename + '/filters';
                var filename = filtername + '.filter';
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
