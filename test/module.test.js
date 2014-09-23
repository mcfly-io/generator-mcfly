'use strict';

var helpers = require('yeoman-generator').test;
var testHelper = require('./testHelper');
var modulename = 'common';

describe('angular-famous-ionic:module', function () {
	before(function (done) {
		this.runGen = testHelper.runGenerator('module')
			.withOptions({
				'skip-install': true,
				'check-travis': false,
				'check-git': true
			})
			.withPrompt({
				modulename: modulename
			})
			.on('ready', function () {
				var spyLog = sinon.spy();
				helpers.stub(this.runGen.generator, 'log', spyLog);
				done();
			}.bind(this));

	});

	it('creates files', function () {
		this.runGen.on('end', function () {
			assert.file([
				'client/scripts/' + modulename + '/index.js'
			]);
		});

	});
});