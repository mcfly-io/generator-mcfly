'use strict';

var testHelper = require('./testHelper');
var yosay = require('yosay');
var _ = require('lodash');

describe('generator:app', function() {
    describe('with option mobile false', function() {
        beforeEach(function() {
            this.runGen = testHelper.runGenerator('app', ['sublime:app'])
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true
                })
                .withPrompt({
                    someOption: true
                })
                .on('ready', function(generator) {
                    generator.log = sinon.spy();
                    //helpers.stub(generator, 'log', spyLog);
                });

        });

        it('creates files', function(done) {
            this.runGen.on('end', function() {
                var clientFolder = this.runGen.generator.config.get('clientFolder');

                assert.file([
                    'package.json',
                    'bower.json',
                    '.bowerrc',
                    'karma.conf.js',
                    'protractor.conf.js',
                    'webpack.config.js',
                    'bin/prepublish.sh',
                    'bin/protractor-fix-version.js',
                    'bin/cordova-generate-icons',
                    'bin/cordova-generate-splashes',
                    clientFolder + '/.eslintrc',
                    clientFolder + '/index.html',
                    clientFolder + '/404.html',
                    clientFolder + '/robots.txt',
                    clientFolder + '/favicon.ico',
                    clientFolder + '/styles/main.scss',
                    clientFolder + '/styles/main.less',
                    clientFolder + '/scripts/main.js',
                    clientFolder + '/scripts/main.test.js',
                    clientFolder + '/scripts/tests.webpack.js',
                    clientFolder + '/images',
                    clientFolder + '/icons',
                    clientFolder + '/fonts',
                    'srcmaps',
                    'test/.jshintrc',
                    'test/e2e/app/e2e.test.js',
                    'test/e2e/.eslintrc',
                    'test/mocha/helpers/globals.js',
                    'test/unit/unitHelper.js',
                    'test/unit/polyfill.js'
                ]);
                done();
            }.bind(this));

        });

        it('package.json should reference prepublish.sh');

        it('should display woot message if installation is successfull');

        it('should skip welcome message when skip-welcome-message is true', function(done) {
            this.runGen
                .withOptions({
                    'skip-welcome-message': true
                })
                .on('end', function() {
                    assert.equal(this.runGen.generator.log.calledWith(yosay('Welcome to the amazing mcfly generator!')), false);
                    done();
                }.bind(this));
        });

        it('should display welcome message when skip-welcome-message is false', function(done) {
            this.runGen
                .withOptions({
                    'skip-welcome-message': false
                })
                .on('end', function() {
                    assert(this.runGen.generator.log.calledWith(yosay('Welcome to the amazing mcfly generator!')));
                    done();
                }.bind(this));
        });

        it('should save configuration in .yo-rc.json', function(done) {
            this.runGen.on('end', function() {
                assert.file([
                    '.yo-rc.json'
                ]);
                var config = testHelper.readJsonFile('.yo-rc.json');
                assert(config['generator-mcfly'].appname !== undefined, 'appname does not exist in .yo-rc.json');
                assert(config['generator-mcfly'].filenameCase !== undefined, 'filenameCase does not exist in .yo-rc.json');
                assert(config['generator-mcfly'].filenameSuffix !== undefined, 'filenameSuffix does not exist in .yo-rc.json');
                assert(config['generator-mcfly'].bootstrap !== undefined, 'bootstrap does not exist in .yo-rc.json');
                assert(config['generator-mcfly'].ionic !== undefined, 'ionic does not exist in .yo-rc.json');
                assert(config['generator-mcfly'].famous !== undefined, 'famous does not exist in .yo-rc.json');
                assert(config['generator-mcfly'].ngCordova !== undefined, 'ngCordova does not exist in .yo-rc.json');
                assert(config['generator-mcfly'].material !== undefined, 'angular-material does not exist in .yo-rc.json');
                assert(config['generator-mcfly'].clientFolder !== undefined, 'clientFolder does not exist in .yo-rc.json');

                done();
            });
        });
    });

    describe('with option mobile true', function() {
        beforeEach(function() {
            this.runGen = testHelper.runGenerator('app', ['sublime:app'])
                .withOptions({
                    'skip-install': true,
                    'check-travis': false,
                    'check-git': true,
                    'mobile': true
                })
                .withPrompt({
                    someOption: true
                })
                .on('ready', function(generator) {
                    generator.log = sinon.spy();
                    //helpers.stub(generator, 'log', spyLog);
                });

        });

        it('creates files', function(done) {
            this.runGen.on('end', function() {
                var clientFolder = this.runGen.generator.config.get('clientFolder');

                assert.file([
                    'package.json',
                    'bower.json',
                    '.bowerrc',
                    'karma.conf.js',
                    'protractor.conf.js',
                    'webpack.config.js',
                    'bin/prepublish.sh',
                    'bin/protractor-fix-version.js',
                    'bin/cordova-generate-icons',
                    'bin/cordova-generate-splashes',
                    clientFolder + '/.eslintrc',
                    clientFolder + '/index.html',
                    clientFolder + '/404.html',
                    clientFolder + '/robots.txt',
                    clientFolder + '/favicon.ico',
                    clientFolder + '/styles/main.scss',
                    clientFolder + '/styles/main.less',
                    clientFolder + '/scripts/main.js',
                    clientFolder + '/scripts/main.test.js',
                    clientFolder + '/images',
                    clientFolder + '/icons',
                    clientFolder + '/fonts',
                    clientFolder + '/cordova/' + 'app' + '/hooks' + '/before_platform_add/010_install_plugins.js',
                    clientFolder + '/cordova/' + 'app' + '/hooks' + '/after_prepare/010_add_platform_class.js',
                    clientFolder + '/config.xml',
                    'test/e2e/app/e2e.test.js',
                    'test/e2e/.eslintrc',
                    'test/mocha/helpers/globals.js'
                ]);
                done();
            }.bind(this));

        });

        it('references cordova.js in index.html', function(done) {
            this.runGen.on('end', function() {
                var clientFolder = this.runGen.generator.config.get('clientFolder');

                var file = clientFolder + '/index' + '.html';
                var body = testHelper.readTextFile(file);
                assert(_.contains(body, 'cordova.js'));

                done();
            }.bind(this));
        });

    });
});