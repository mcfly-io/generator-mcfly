'use strict';

var testHelper = require('./testHelper');
var subcomponents = require('../class/subcomponents.js');
var clientFolder = 'www';

describe('angular-famous-ionic:require', function() {

    beforeEach(function() {
        this.runGen = testHelper.runGenerator('require')
            .withOptions({
                'skip-install': true,
                'check-travis': false,
                'check-git': true
            })
            .on('ready', function(generator) {
                generator.clientFolder = clientFolder;
                generator.log = sinon.spy();

                generator.ionic = true;
                generator.famous = true;
                generator.ngCordova = true;
                generator.ngModules = [];

                generator.suffix = '';
                generator.template('../../templates/target/index.html', clientFolder + '/index.html');
                generator.template('../../templates/target/scripts/main.js', clientFolder + '/scripts/main.js');

                generator.template('../../templates/target/index.html', clientFolder + '/index-xxx.html');
                generator.template('../../templates/target/scripts/main.js', clientFolder + '/scripts/main-xxx.js');
                console.log('GOOD');
                ['toto', 'tata'].forEach(function(module) {
                    generator.modulename = module;
                    generator.mkdir(clientFolder + '/scripts/' + module);
                    generator.template('../../templates/module/index.js', clientFolder + '/scripts/' + module + '/index.js');
                    subcomponents.forEach(function(component) {
                        generator.template('../../templates/component/index.js', clientFolder + '/scripts/' + module + '/' + component + '/index.js');
                    });

                });

            });
    });

    it('creates files', function(done) {
        this.runGen.on('end', function() {
            setTimeout(function() {
                console.log('CHECK');
                var suffix = '-xxx';
                var file = clientFolder + '/scripts/tata/index.js';
                var body = testHelper.readTextFile(file);
                console.log(body);
                done();
            },1000);

            //var folder = clientFolder + '/scripts/' + modulename + '/values';
            //var file = folder + '/' + valuename + '.js';
            //var filetest = folder + '/' + valuename + '.test.js';
            //assert.file([
            //    file,
            //    filetest
            //]);

        });

    });

});