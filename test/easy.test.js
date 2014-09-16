'use strict';

var path = require('path');
//var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');
//var Easy = require('../class');
//var generatorFactory = require('yeoman-generator');

xdescribe('easy generator', function() {
    var easy;
    before(function(done) {
        //var env = generatorFactory(null, null);
        var generator = path.join(__dirname, '../class');

        //         var namespace = env.namespace(generator);
        //         env.register(generator);
        //         easy = env.create(namespace, {
        //             arguments: null,
        //             options: null
        //         });

        easy = helpers.createGenerator(generator, []);

        done();
        this.runGen = helpers.run(path.join(__dirname, '../class'))
            .inDir(path.join(os.tmpdir(), './temp-test'))
            .withOptions({
                'skip-install': true,
                'check-travis': false,
                'check-git': true
            })
            .withPrompt({
                someOption: true
            })
            .on('end', done);
    });

    it('notifyUpdate ', function() {
        var pkg = {
            name: 'generator-sublime',
            version: '0.0.1'
        };
        easy.notifyUpdate(pkg);

    });
});