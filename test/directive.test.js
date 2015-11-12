'use strict';

global.Promise = require('bluebird');
var testHelper = require('./testHelper');
var _ = require('lodash');
var modulename = 'common';
var directivename = 'myDirective';
var clientFolder = 'www';

require('./helpers/globals');

describe('generator:directive', function() {
    describe('with modules', function() {
        beforeEach(function() {
            this.runGen = testHelper.runGenerator('directive')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompts({
                    modulename: modulename,
                    directivename: directivename
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
                var folder = clientFolder + '/scripts/' + modulename + '/directives';
                var file = folder + '/' + directivename + '.js';
                var fileHtml = folder + '/' + directivename + '.html';
                var filetest = folder + '/' + directivename + '.test.js';
                assert.file([
                    file,
                    fileHtml,
                    filetest
                ]);
                var body = testHelper.readTextFile(file);
                assert(!_.contains(body, 'link:'), 'link function should not be found');
                assert(_.contains(body, 'compile:'), 'compile function should be found');
                assert(_.contains(body, 'pre:'), 'pre function should be found');
                assert(_.contains(body, 'post:'), 'post function should be found');

                done();
            });

        });

        it('directive file should contain directive name', function(done) {
            this.runGen.on('end', function() {
                var folder = clientFolder + '/scripts/' + modulename + '/directives';
                var file = folder + '/' + directivename + '.js';
                var body = testHelper.readTextFile(file);
                assert(_.contains(body, 'var directivename = \'' + directivename + '\';'));
                done();
            });
        });

        it('module should reference directives folder', function(done) {
            this.runGen.on('end', function() {
                setTimeout(function() {
                    var folder = clientFolder + '/scripts/' + modulename;
                    var body = testHelper.readTextFile(folder + '/index.js');
                    assert(_.contains(body, 'require(\'./directives\')(app);'));
                    done();
                }, 200);

            });
        });

        it('directives/index.js should reference directive file', function(done) {
            this.runGen.on('end', function() {
                setTimeout(function() {
                    var folder = clientFolder + '/scripts/' + modulename + '/directives';
                    var body = testHelper.readTextFile(folder + '/index.js');
                    assert(_.contains(body, 'require(\'./' + directivename + '\')(app);'));
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

        xit('with empty directivename should throw an error', function(done) {
            this.runGen
                .withPrompts({
                    modulename: modulename,
                    directivename: ''
                })
                .on('end', function() {
                    assert(_.isEqual(this.runGen.generator.prompt.errors, [{
                        name: 'directivename',
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

        it('with argument modulename and directivename should not prompt', function(done) {
            this.runGen
                .withArguments([modulename, directivename])
                .on('end', function() {
                    assert.equal(this.runGen.generator.modulename, modulename);
                    assert.equal(this.runGen.generator.directivename, directivename);
                    assert.equal(this.runGen.generator.prompt.errors, undefined);
                    done();
                }.bind(this));
        });

    });

    describe('without modules', function() {

        it('should emit error when #getClientModules() fails', function(done) {
            var ctx = testHelper.runGenerator('directive')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompts({
                    modulename: modulename,
                    directivename: directivename
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
            var ctx = testHelper.runGenerator('directive')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompts({
                    modulename: modulename,
                    directivename: directivename
                })
                .on('ready', function(generator) {
                    generator.clientFolder = clientFolder;
                    generator.log = sinon.spy();
                    generator.getClientModules = function() {
                        return Promise.resolve();
                    };
                })
                .on('error', function(err) {
                    assert(ctx.generator.log.calledOnce);
                    assert.equal(err, 'No module found');
                })
                .on('end', function() {
                    done();
                });
        });
    });

    describe('with option compile true', function() {
        beforeEach(function() {
            this.runGen = testHelper.runGenerator('directive')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true,
                    'compile': true
                })
                .withPrompts({
                    modulename: modulename,
                    directivename: directivename
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
                var folder = clientFolder + '/scripts/' + modulename + '/directives';
                var file = folder + '/' + directivename + '.js';
                var fileHtml = folder + '/' + directivename + '.html';
                var filetest = folder + '/' + directivename + '.test.js';
                assert.file([
                    file,
                    fileHtml,
                    filetest
                ]);
                var body = testHelper.readTextFile(file);
                assert(!_.contains(body, 'link:'), 'link function should not be found');
                assert(_.contains(body, 'compile:'), 'compile function should be found');
                assert(_.contains(body, 'pre:'), 'pre function should be found');
                assert(_.contains(body, 'post:'), 'post function should be found');
                done();
            });

        });
    });

    describe('with option compile false', function() {
        beforeEach(function() {
            this.runGen = testHelper.runGenerator('directive')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true,
                    'compile': false
                })
                .withPrompts({
                    modulename: modulename,
                    directivename: directivename
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
                var folder = clientFolder + '/scripts/' + modulename + '/directives';
                var file = folder + '/' + directivename + '.js';
                var fileHtml = folder + '/' + directivename + '.html';
                var filetest = folder + '/' + directivename + '.test.js';
                assert.file([
                    file,
                    fileHtml,
                    filetest
                ]);
                var body = testHelper.readTextFile(file);
                assert(_.contains(body, 'link:'), 'link function should be found');
                assert(!_.contains(body, 'compile:'), 'compile function should not be found');
                assert(!_.contains(body, 'pre:'), 'pre function should not be found');
                assert(!_.contains(body, 'post:'), 'post function should not be found');
                done();
            });

        });
    });
    describe('with snake-case', function() {
        beforeEach(function() {
            this.runGen = testHelper.runGenerator('directive')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompts({
                    modulename: modulename,
                    directivename: directivename
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
                var folder = clientFolder + '/scripts/' + modulename + '/directives';
                var filename = _.snakeCase(directivename);
                var file = folder + '/' + filename + '.js';
                var fileHtml = folder + '/' + filename + '.html';
                var filetest = folder + '/' + filename + '.test.js';
                assert.file([
                    file,
                    fileHtml,
                    filetest
                ]);

                assert(this.configGet.calledWith('filenameCase'));
                done();
            }.bind(this));

        });

    });
    describe('with type suffix', function() {
        beforeEach(function() {
            this.runGen = testHelper.runGenerator('directive')
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompts({
                    modulename: modulename,
                    directivename: directivename
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
                var folder = clientFolder + '/scripts/' + modulename + '/directives';
                var filename = directivename + '.directive';
                var file = folder + '/' + filename + '.js';
                var fileHtml = folder + '/' + filename + '.html';
                var filetest = folder + '/' + filename + '.test.js';
                var body = testHelper.readTextFile(file);
                assert(_.contains(body, 'template: require(\'./' + filename + '.html' + '\'),'), 'template should reference suffix html file name');

                assert.file([
                    file,
                    fileHtml,
                    filetest
                ]);

                assert(this.configGet.calledWith('filenameSuffix'));
                done();
            }.bind(this));

        });

    });
});
