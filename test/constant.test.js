'use strict';

var testHelper = require('./testHelper');
var Q = require('q');
var _ = require('lodash');
var modulename = 'common';
var constantname = 'myConstant';
var clientFolder = 'www';

describe('angular-famous-ionic:constant', function() {
    describe('with modules', function() {
        beforeEach(function() {
            this.runGen = testHelper.runGenerator('constant')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompt({
                    modulename: modulename,
                    constantname: constantname
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

        it('with empty constantname should throw an error', function(done) {
            this.runGen
                .withPrompt({
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
                .withPrompt({
                    modulename: modulename,
                    constantname: constantname
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
            var ctx = testHelper.runGenerator('constant')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompt({
                    modulename: modulename,
                    constantname: constantname
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

});