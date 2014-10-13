'use strict';

var testHelper = require('./testHelper');
var yosay = require('yosay');

describe('angular-famous-ionic:app', function() {
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
            assert.file([
                'package.json',
                'bower.json',
                'karma.conf.js',
                'protractor.conf.js',
                'bin/prepublish.sh',
                'client/.eslintrc',
                'client/index.html',
                'client/404.html',
                'client/styles/main.scss',
                'client/scripts/main.js',
                'test/e2e/e2e.test.js',
                'test/e2e/.eslintrc',
                'test/mocha/helpers/globals.js'
            ]);
            done();
        });

    });

    it('package.json should reference prepublish.sh');

    it('should display woot message if installation is successfull');

    it('should skip welcome message when skip-welcome-message is true', function(done) {
        this.runGen
            .withOptions({
                'skip-welcome-message': true
            })
            .on('end', function() {
                assert.equal(this.runGen.generator.log.calledWith(yosay('Welcome to the amazing angular-famous-ionic generator!')), false);
                done();
            }.bind(this));
    });

    it('should display welcome message when skip-welcome-message is false', function(done) {
        this.runGen
            .withOptions({
                'skip-welcome-message': false
            })
            .on('end', function() {
                assert(this.runGen.generator.log.calledWith(yosay('Welcome to the amazing angular-famous-ionic generator!')));
                done();
            }.bind(this));
    });

    it('should save configuration in .yo-rc.json', function(done) {
        this.runGen.on('end', function() {
            assert.file([
                '.yo-rc.json'
            ]);
            var config = testHelper.readJsonFile('.yo-rc.json');
            assert(config['generator-angular-famous-ionic'].ionic !== undefined, 'ionic does not exist in .yo-rc.json');
            assert(config['generator-angular-famous-ionic'].bootstrap !== undefined, 'bootrap does not exist in .yo-rc.json');
            assert(config['generator-angular-famous-ionic'].famous !== undefined, 'famous does not exist in .yo-rc.json');
            done();
        });
    });
});