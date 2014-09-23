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
            .on('ready', function() {
                var spyLog = sinon.spy();
                helpers.stub(this.runGen.generator, 'log', spyLog);
                done();
            }.bind(this));

    });

    it('creates files', function() {
        this.runGen.on('end', function() {
            assert.file([
                'package.json',
                'bower.json',
                'karma.conf.js',
                'client/index.html',
                'client/styles/main.css',
                'client/scripts/main.js'
            ]);
        });

    });
});