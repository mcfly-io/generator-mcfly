'use strict';

var path = require('path');
//var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');
//var easy = require('../easy');

describe('easy generator', function() {
    before(function(done) {
        this.runGen = helpers.run(path.join(__dirname, '../class/easy'))
            .inDir(path.join(os.tmpdir(), './temp-test'))
            .withOptions({
                'skip-install': true
            })
            .withPrompt({
                someOption: true
            })
            .on('end', done);
    });

    it('creates files', function() {

    });
});