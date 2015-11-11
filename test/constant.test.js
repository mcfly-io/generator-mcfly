'use strict';

global.Promise = require('bluebird');
var testHelper = require('./testHelper');
var _ = require('lodash');
var modulename = 'common';
var constantname = 'myConstant';
var clientFolder = 'www';

require('./helpers/globals');

describe('generator:constant', function() {
    describe('with modules', function() {
        beforeEach(function() {
            this.runGen = testHelper.runGenerator('constant')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompts({
                    modulename: modulename,
                    constantname: constantname
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
                var folder = clientFolder + '/scripts/' + modulename + '/constants';
                var file = folder + '/' + constantname + '.js';
                var filetest = folder + '/' + constantname + '.test.js';
                assert.file([
                    file,
                    filetest
                ]);

                done();
            });

        });

        it('constant file should contain constant name', function(done) {
            this.runGen.on('end', function() {
                var folder = clientFolder + '/scripts/' + modulename + '/constants';
                var file = folder + '/' + constantname + '.js';
                var body = testHelper.readTextFile(file);
                assert(_.contains(body, 'var constantname = \'' + constantname + '\';'));
                done();
            });
        });

        it('module should reference constants folder', function(done) {
            this.runGen.on('end', function() {

                setTimeout(function() {
                    var folder = clientFolder + '/scripts/' + modulename;
                    var body = testHelper.readTextFile(folder + '/index.js');

                    assert(_.contains(body, 'require(\'./constants\')(app);'));
                    done();
                }, 200);

            });
        });

        it('constants/index.js should reference constant file', function(done) {
            this.runGen.on('end', function() {

                setTimeout(function() {
                    var folder = clientFolder + '/scripts/' + modulename + '/constants';
                    var body = testHelper.readTextFile(folder + '/index.js');
                    assert(_.contains(body, 'require(\'./' + constantname + '\')(app);'));
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

        xit('with empty constantname should throw an error', function(done) {
            this.runGen
                .withPrompts({
                    modulename: modulename,
                    constantname: ''
                })
                .on('end', function() {
                    assert(_.isEqual(this.runGen.generator.prompt.errors, [{
                        name: 'constantname',
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

        it('with argument modulename and constantname should not prompt', function(done) {
            this.runGen
                .withArguments([modulename, constantname])
                .on('end', function() {
                    assert.equal(this.runGen.generator.modulename, modulename);
                    assert.equal(this.runGen.generator.constantname, constantname);
                    assert.equal(this.runGen.generator.prompt.errors, undefined);
                    done();
                }.bind(this));
        });

    });

    describe('without modules', function() {

        it('should emit error when #getClientModules() fails', function(done) {
            var ctx = testHelper.runGenerator('constant')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompts({
                    modulename: modulename,
                    constantname: constantname
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
                    //done();
                })
                .on('end', done);

        });

        it('should emit error when no module', function(done) {
            var ctx = testHelper.runGenerator('constant')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompts({
                    modulename: modulename,
                    constantname: constantname
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
            this.runGen = testHelper.runGenerator('constant')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompts({
                    modulename: modulename,
                    constantname: constantname
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
                var folder = clientFolder + '/scripts/' + modulename + '/constants';
                var filename = _.snakeCase(constantname);
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
            this.runGen = testHelper.runGenerator('constant')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompts({
                    modulename: modulename,
                    constantname: constantname
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
                var folder = clientFolder + '/scripts/' + modulename + '/constants';
                var filename = constantname + '.constant';
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
