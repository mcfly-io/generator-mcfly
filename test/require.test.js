'use strict';

var testHelper = require('./testHelper');
var subcomponents = require('../class/subcomponents.js');
var clientFolder = 'www';
var _ = require('lodash');

require('./helpers/globals');

var suffixes = ['', '-xxx'];
var modules = ['toto', 'tata'];
var files = _.range(2);

describe('generator:require', function() {

    before(function(done) {
        this.runGen = testHelper.runGenerator('require')
            //             .withOptions({
            //                 'skip-install': true,
            //                 'check-travis': false,
            //                 'check-git': true
            //             })
            .on('ready', function(generator) {
                generator.clientFolder = clientFolder;
                generator.log = sinon.spy();

                // set options
                testHelper.setOptions(generator);

                suffixes.forEach(function(suffix) {
                    generator.suffix = suffix;
                    generator.mobile = false;
                    generator.template('../../templates/target/index.html', clientFolder + '/index' + suffix + '.html');
                    generator.template('../../templates/target/scripts/main.js', clientFolder + '/scripts/main' + suffix + '.js');

                });

                modules.forEach(function(module) {
                    generator.modulename = module;
                    generator.utils.mkdir(clientFolder + '/scripts/' + module);
                    generator.template('../../templates/module/index.js', clientFolder + '/scripts/' + module + '/index.js');
                    subcomponents.forEach(function(component) {
                        var singularComponent = component.substring(0, component.length - 1);
                        generator.template('../../templates/component/index.js', clientFolder + '/scripts/' + module + '/' + component + '/index.js');
                        files.forEach(function(index) {
                            // building the name of the component expected by the template
                            generator[singularComponent + 'name'] = singularComponent + index;
                            // building the filename
                            generator.filename = generator[singularComponent + 'name'];
                            // generating the template
                            generator.template('../../templates/' + (singularComponent === 'service' ? singularComponent + '/index.service.js' : singularComponent + '/index.js'), clientFolder + '/scripts/' + module + '/' + component + '/' + index + '.js');
                        });
                    });

                });

            }).on('end', function() {
                setTimeout(function() {
                    done();
                }, 300);
            });
    });

    //     it('creates files', function(done) {
    //         this.runGen.on('end', function() {
    //             setTimeout(function() {
    //                 console.log('CHECK');
    //                 var suffix = '-xxx';
    //                 var file = clientFolder + '/scripts/tata/index.js';
    //                 var body = testHelper.readTextFile(file);
    //                 console.log(body);
    //                 done();
    //             }, 300);
    //         });

    //     });

    it('check requires for main.js', function() {

        suffixes.forEach(function(suffix) {
            var file = clientFolder + '/scripts/main' + suffix + '.js';
            var body = testHelper.readTextFile(file);
            modules.forEach(function(module) {
                var check = 'require(\'./' + module + '\')(namespace).name';
                assert(_.contains(body, check), check + ' does not appear in \n' + body);
            });

        });

    });

    it('check requires for module/index.js', function() {
        modules.forEach(function(module) {
            var file = clientFolder + '/scripts/' + module + '/index.js';
            var body = testHelper.readTextFile(file);
            subcomponents.forEach(function(component) {
                var check = 'require(\'./' + component + '\')(app);';
                assert(_.contains(body, check), check + ' does not appear in \n' + body);
            });
        });
    });

    it('check requires for module/component/indexjs', function() {
        modules.forEach(function(module) {
            subcomponents.forEach(function(component) {

                var file = clientFolder + '/scripts/' + module + '/' + component + '/index.js';
                var body = testHelper.readTextFile(file);

                files.forEach(function(index) {
                    var check = 'require(\'./' + index + '\')(app);';
                    assert(_.contains(body, check), check + ' does not appear in \n' + body);
                });

            });
        });

    });

});
