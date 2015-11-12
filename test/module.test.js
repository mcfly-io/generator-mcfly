'use strict';

global.Promise = require('bluebird');
var testHelper = require('./testHelper');
var _ = require('lodash');
var utils = require('../utils');
var modulename = 'common';
var clientFolder = 'www';

require('./helpers/globals');

describe('generator:module', function() {

    describe('general test', function() {
        beforeEach(function() {
            this.runGen = testHelper.runGenerator('module')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompts({
                    modulename: modulename
                })
                .on('ready', function(generator) {
                    generator.clientFolder = clientFolder;
                    generator.mobile = false;
                    generator.bootstrap = false;
                    generator.log = sinon.spy();
                    generator.suffix = '';
                    generator.template('../../templates/target/index.html', clientFolder + '/index.html');
                    generator.template('../../templates/target/scripts/main.js', clientFolder + '/scripts/main.js');

                    generator.template('../../templates/target/index.html', clientFolder + '/index-xxx.html');
                    generator.template('../../templates/target/scripts/main.js', clientFolder + '/scripts/main-xxx.js');

                    generator.utils.mkdir(clientFolder + '/scripts/toto');
                    generator.utils.mkdir(clientFolder + '/scripts/tata');

                });

        });

        it('creates files', function(done) {
            this.runGen.on('end', function() {
                var folder = clientFolder + '/scripts/' + modulename;
                var file = folder + '/index.js';
                assert.file([
                    file,
                    folder + '/tests.webpack.js'
                ]);
                done();
            });

        });

        it('should inject modules in target file', function(done) {

            this.runGen
                .on('end', function() {
                    ['', '-xxx'].forEach(function(suffix) {

                        var file = clientFolder + '/scripts/main' + suffix + '.js';
                        var body = testHelper.readTextFile(file);

                        assert(_.contains(body, 'require(\'./common\')(namespace).name'));
                        assert(_.contains(body, 'require(\'./tata\')(namespace).name'));
                        assert(_.contains(body, 'require(\'./toto\')(namespace).name'));
                    });
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

        xit('with passing existing modulename should throw an error', function(done) {
            this.runGen
                .withPrompts({
                    modulename: 'toto'
                })
                .on('error', function(err) {
                    assert(err instanceof Error);
                })
                .on('end', done);
        });

        xit('with prompting existing modulename should throw an error', function(done) {
            this.runGen
                .withPrompts({
                    modulename: 'toto'
                })
                .on('error', function() {
                    assert(_.isEqual(this.runGen.generator.prompt.errors, [{
                        name: 'modulename',
                        message: 'The module name toto already exists'
                    }]));
                }.bind(this))
                .on('end', done);
        });

        it('with new modulename should succeed', function(done) {
            this.runGen
                .withPrompts({
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
                .withPrompts({
                    modulename: modulename
                })
                .on('ready', function(generator) {
                    generator.clientFolder = clientFolder;
                    generator.bootstrap = false;
                    generator.log = sinon.spy();
                    generator.getClientModules = function() {

                        return new Promise(function(resolve, reject) {
                            reject('an error occured');
                        });
                    };
                })
                .on('error', function(err) {
                    assert.equal(err, 'No module found');
                })
                .on('end', done);

        });
    });

    describe('angular modules', function() {

        it('should include ionic-angular with ionic', function(done) {
            testHelper.runGenerator('module')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompts({
                    modulename: modulename
                })
                .on('ready', function(generator) {
                    generator.clientFolder = clientFolder;
                    generator.log = sinon.spy();

                    //generator.afterInitializing = function() {
                    generator.ionic = true;
                    generator.bootstrap = false;
                    generator.ngModules = utils.getNgModules(generator);

                    //};
                    generator.utils.mkdir(clientFolder + '/scripts/toto');
                    generator.utils.mkdir(clientFolder + '/scripts/tata');
                })
                .on('end', function() {
                    var file = clientFolder + '/scripts/' + modulename + '/index.js';
                    var body = testHelper.readTextFile(file);
                    assert(_.contains(body, 'require(\'ionic-angular\');'));
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
                .withPrompts({
                    modulename: modulename
                })
                .on('ready', function(generator) {
                    generator.clientFolder = clientFolder;
                    generator.log = sinon.spy();

                    //generator.afterInitializing = function() {
                    generator.famous = true;
                    generator.bootstrap = false;
                    generator.ngModules = utils.getNgModules(generator);

                    //};
                    generator.utils.mkdir(clientFolder + '/scripts/toto');
                    generator.utils.mkdir(clientFolder + '/scripts/tata');
                })
                .on('end', function() {
                    var file = clientFolder + '/scripts/' + modulename + '/index.js';
                    var body = testHelper.readTextFile(file);
                    assert(_.contains(body, 'require(\'famous-angular\');'));
                    assert(_.contains(body, '\'famous.angular\''));
                    done();
                });

        });

        it('should include angular-material with material', function(done) {
            testHelper.runGenerator('module')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompts({
                    modulename: modulename
                })
                .on('ready', function(generator) {
                    generator.clientFolder = clientFolder;
                    generator.log = sinon.spy();

                    //generator.afterInitializing = function() {
                    generator.material = true;
                    generator.bootstrap = false;
                    generator.ngModules = utils.getNgModules(generator);
                    //};
                    generator.utils.mkdir(clientFolder + '/scripts/toto');
                    generator.utils.mkdir(clientFolder + '/scripts/tata');
                })
                .on('end', function() {
                    var file = clientFolder + '/scripts/' + modulename + '/index.js';
                    var body = testHelper.readTextFile(file);
                    assert(_.contains(body, 'require(\'angular-material\');'));
                    assert(_.contains(body, '\'ngMaterial\''));
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
                .withPrompts({
                    modulename: modulename
                })
                .on('ready', function(generator) {
                    generator.clientFolder = clientFolder;
                    generator.log = sinon.spy();

                    //generator.afterInitializing = function() {
                    generator.ngCordova = true;
                    generator.bootstrap = false;
                    generator.ngModules = utils.getNgModules(generator);

                    //};
                    generator.utils.mkdir(clientFolder + '/scripts/toto');
                    generator.utils.mkdir(clientFolder + '/scripts/tata');
                })
                .on('end', function() {
                    var file = clientFolder + '/scripts/' + modulename + '/index.js';
                    var body = testHelper.readTextFile(file);
                    assert(_.contains(body, 'require(\'ng-cordova\');'));
                    done();
                });

        });

        it('should include famous-angular and ionic-angular with famous, ionic, ngCordova, and material', function(done) {
            testHelper.runGenerator('module')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompts({
                    modulename: modulename
                })
                .on('ready', function(generator) {
                    generator.clientFolder = clientFolder;
                    generator.log = sinon.spy();

                    //generator.afterInitializing = function() {
                    generator.famous = true;
                    generator.ionic = true;
                    generator.ngCordova = true;
                    generator.material = true;
                    generator.bootstrap = false;
                    generator.ngModules = utils.getNgModules(generator);

                    //};
                    generator.utils.mkdir(clientFolder + '/scripts/toto');
                    generator.utils.mkdir(clientFolder + '/scripts/tata');
                })
                .on('end', function() {
                    var file = clientFolder + '/scripts/' + modulename + '/index.js';
                    var body = testHelper.readTextFile(file);

                    assert(_.contains(body, 'require(\'famous-angular\');'));
                    assert(_.contains(body, 'require(\'ionic-angular\');'));
                    assert(_.contains(body, 'require(\'ng-cordova\');'));
                    assert(_.contains(body, 'require(\'angular-material\');'));
                    assert(_.contains(body, '\'ionic\''));
                    assert(_.contains(body, '\'famous.angular\''));
                    done();
                });

        });

        it('should exclude routes with skip-route equal true', function(done) {
            testHelper.runGenerator('module')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true,
                    'skip-route': true
                })
                .withPrompts({
                    modulename: modulename
                })
                .on('ready', function(generator) {
                    generator.clientFolder = clientFolder;
                    generator.log = sinon.spy();

                    //generator.afterInitializing = function() {
                    generator.famous = true;
                    generator.ionic = true;
                    generator.ngCordova = true;
                    generator.material = true;
                    generator.bootstrap = false;
                    generator.ngModules = utils.getNgModules(generator);

                    //};
                    generator.utils.mkdir(clientFolder + '/scripts/toto');
                    generator.utils.mkdir(clientFolder + '/scripts/tata');
                })
                .on('end', function() {
                    var file = clientFolder + '/scripts/' + modulename + '/index.js';
                    var body = testHelper.readTextFile(file);

                    assert(!_.contains(body, '$stateProvider'));

                    assert.noFile([
                        clientFolder + '/scripts/' + modulename + '/views/home.html'
                    ]);
                    done();
                });

        });

        it('should include routes with skip-route equal true', function(done) {
            testHelper.runGenerator('module')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true,
                    'skip-route': false
                })
                .withPrompts({
                    modulename: modulename
                })
                .on('ready', function(generator) {
                    generator.clientFolder = clientFolder;
                    generator.log = sinon.spy();

                    //generator.afterInitializing = function() {
                    generator.famous = true;
                    generator.ionic = true;
                    generator.ngCordova = true;
                    generator.material = true;
                    generator.bootstrap = false;
                    generator.ngModules = utils.getNgModules(generator);

                    //};
                    generator.utils.mkdir(clientFolder + '/scripts/toto');
                    generator.utils.mkdir(clientFolder + '/scripts/tata');
                })
                .on('end', function() {
                    var file = clientFolder + '/scripts/' + modulename + '/index.js';
                    var body = testHelper.readTextFile(file);

                    assert(_.contains(body, '$stateProvider'), '$stateProvider');

                    assert.file([
                        clientFolder + '/scripts/' + modulename + '/views/home.html'
                    ]);
                    done();
                });

        });
    });

    describe('with snake-case', function() {

        beforeEach(function() {
            this.modulename = 'snakeCaseTest';
            this.runGen = testHelper.runGenerator('module')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompts({
                    modulename: this.modulename
                })
                .on('ready', function(generator) {
                    generator.clientFolder = clientFolder;
                    generator.mobile = false;
                    generator.bootstrap = false;
                    generator.log = sinon.spy();
                    generator.suffix = '';

                    this.configGet = sinon.stub();
                    this.configGet.withArgs('filenameCase').returns('snake');

                    generator.config.get = this.configGet;
                    generator.template('../../templates/target/index.html', clientFolder + '/index.html');
                    generator.template('../../templates/target/scripts/main.js', clientFolder + '/scripts/main.js');

                    generator.template('../../templates/target/index.html', clientFolder + '/index-xxx.html');
                    generator.template('../../templates/target/scripts/main.js', clientFolder + '/scripts/main-xxx.js');

                    generator.utils.mkdir(clientFolder + '/scripts/toto');
                    generator.utils.mkdir(clientFolder + '/scripts/tata');

                    // set options
                    testHelper.setOptions(generator);

                }.bind(this));

        });

        it('creates files with correct case', function(done) {
            this.runGen.on('end', function() {
                var moduleFolder = _.snakeCase(this.modulename);
                var folder = clientFolder + '/scripts/' + moduleFolder;
                var file = folder + '/index.js';
                assert.file([
                    file,
                    folder + '/tests.webpack.js'
                ]);

                assert(this.configGet.calledWith('filenameCase'));
                done();
            }.bind(this));

        });
    });

    describe('with type suffixes', function() {

        beforeEach(function() {
            this.runGen = testHelper.runGenerator('module')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompts({
                    modulename: modulename
                })
                .on('ready', function(generator) {
                    generator.clientFolder = clientFolder;
                    generator.mobile = false;
                    generator.bootstrap = false;
                    generator.log = sinon.spy();
                    generator.suffix = '';

                    this.configGet = sinon.stub();
                    this.configGet.withArgs('filenameSuffix').returns(true);

                    generator.config.get = this.configGet;
                    generator.template('../../templates/target/index.html', clientFolder + '/index.html');
                    generator.template('../../templates/target/scripts/main.js', clientFolder + '/scripts/main.js');

                    generator.template('../../templates/target/index.html', clientFolder + '/index-xxx.html');
                    generator.template('../../templates/target/scripts/main.js', clientFolder + '/scripts/main-xxx.js');

                    generator.utils.mkdir(clientFolder + '/scripts/toto');
                    generator.utils.mkdir(clientFolder + '/scripts/tata');
                }.bind(this));

        });

        it('creates files with correct suffix', function(done) {
            this.runGen.on('end', function() {
                var folder = clientFolder + '/scripts/' + modulename;
                var file = folder + '/index.js';
                assert.file([
                    file,
                    folder + '/tests.webpack.js'
                ]);

                //assert(this.configGet.notCalledWith('filenameSuffix'));
                done();
            });

        });

        it('should inject modules in target file xxx', function(done) {

            this.runGen
                .on('end', function() {
                    ['', '-xxx'].forEach(function(suffix) {

                        var file = clientFolder + '/scripts/main' + suffix + '.js';
                        var body = testHelper.readTextFile(file);

                        assert(_.contains(body, 'require(\'./common\')(namespace).name'));
                        assert(_.contains(body, 'require(\'./tata\')(namespace).name'));
                        assert(_.contains(body, 'require(\'./toto\')(namespace).name'));
                    });
                    done();
                });

        });

    });

});
