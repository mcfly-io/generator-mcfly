'use strict';

var helpers = require('yeoman-generator').test;
var testHelper = require('./testHelper');

describe('angular-famous-ionic:app', function() {
    before(function(done) {
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
                var spyLog = sinon.spy();
                helpers.stub(generator, 'log', spyLog);
                done();
            });

    });

    it('creates files', function(done) {
        this.runGen.on('end', function() {
            assert.file([
                'package.json',
                'bower.json',
                'karma.conf.js',
                'bin/prepublish.sh',
                'client/.eslintrc',
                'client/index.html',
                'client/styles/main.css',
                'client/scripts/main.js'
            ]);
            done();
        });

    });

    it('package.json should reference prepublish.sh');

    it('should display woot message if installation is successfull');

});