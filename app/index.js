'use strict';
//var util = require('util');
var path = require('path');
var yosay = require('yosay');
var Class = require('../class');

var AppGenerator = Class.extend({
    constructor: function() {
        Class.apply(this, arguments);
        this.createOptions();

        this.option('check-travis', {
            desc: 'Check if travis cli is installed',
            type: 'Boolean',
            defaults: true
        });

        this.argument('appname', {
            type: String,
            required: false
        });
        this.appname = this.appname || path.basename(process.cwd());
        this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));

    },

    initializing: function() {

        this.pkg = require('../package.json');
        this.notifyUpdate(this.pkg);

        var done = this.async();

        this.checkPython().then(function() {
            done();
        });

        //this.checkTravis().then(function() {
        //    done();
        //});

    },

    prompting: {
        welcome: function() {
            // Have Yeoman greet the user.
            if(!this.options['skip-welcome-message']) {
                this.log(yosay('Welcome to the amazing angular-famous-ionic generator!'));
            }

            this.composeWith('sublime:app', {
                options: {
                    'skip-welcome-message': true
                }
            });

        },
        askFor: function() {
            var done = this.async();

            var prompts = [{
                name: 'clientFolder',
                message: 'How would you like to name the client folder?',
                default: 'www'
            }, {
                name: 'ionic',
                type: 'confirm',
                message: 'Would you like to include ionic framework?',
                default: true
            }, {
                name: 'famous',
                type: 'confirm',
                message: 'Would you like to include famous-angular?',
                default: true
            }, {
                name: 'ngCordova',
                type: 'confirm',
                message: 'Would you like to include ngCordova?',
                default: true
            }, {
                name: 'fontawesome',
                type: 'confirm',
                message: 'Would you like to include font-awesome?',
                default: false
            }, {
                name: 'bootstrap',
                type: 'confirm',
                message: 'Would you like to include bootstrap?',
                default: false
            }];

            this.prompt(prompts, function(answers) {
                this.clientFolder = answers.clientFolder;
                this.bootstrap = answers.bootstrap;
                this.ionic = answers.ionic;
                this.famous = answers.famous;
                this.ngCordova = answers.ngCordova;
                this.fontawesome = answers.fontawesome;
                this.bootstrap = answers.bootstrap;
                this.composeWith('sublime:gulps', {
                    options: {
                        clientFolder: answers.clientFolder,
                        ionic: answers.ionic,
                        famous: answers.famous,
                        fontawesome: answers.fontawesome,
                        bootstrap: answers.bootstrap,
                        lint: true,
                        serve: true,
                        browserify: true,
                        release: true,
                        changelog: true,
                        test: true,
                        style: true
                    }
                });
                done();
            }.bind(this));

        }

        //         _askForModules: function() {
        //             var done = this.async();

        //             var choicesModules = [{
        //                 value: 'animateModule',
        //                 name: 'angular-animate.js',
        //                 checked: true
        //             }, {
        //                 value: 'cookiesModule',
        //                 name: 'angular-cookies.js',
        //                 checked: false
        //             }, {
        //                 value: 'resourceModule',
        //                 name: 'angular-resource.js',
        //                 checked: false
        //             }, {
        //                 value: 'sanitizeModule',
        //                 name: 'angular-sanitize.js',
        //                 checked: true
        //             }];
        //             var prompts = [{
        //                 type: 'checkbox',
        //                 name: 'modules',
        //                 message: 'Which modules would you like to include?',
        //                 choices: choicesModules
        //             }];

        //             this.prompt(prompts, function(answers) {
        //                 // transform the choices into boolean properties on 'this' : this.sanitizeModule
        //                 this.choicesToProperties(answers, choicesModules, 'modules');

        //                 done();
        //             }.bind(this));
        //         }
    },

    configuring: function() {
        this.config.set('clientFolder', this.clientFolder);
        this.config.set('ionic', this.ionic);
        this.config.set('famous', this.famous);
        this.config.set('ngCordova', this.ngCordova);
        this.config.set('fontawesome', this.fontawesome);
        this.config.set('bootstrap', this.bootstrap);
        this.config.forceSave();
    },

    writing: {

        setRoot: function() {
            this.sourceRoot(path.join(__dirname, '../templates/app'));
        },

        projectfiles: function() {
            this.template('_package.json', 'package.json');
            this.template('_bower.json', 'bower.json');
            this.template('_bowerrc', '.bowerrc');
            this.template('karma.conf.js');
            this.template('protractor.conf.js');
            this.template('bin/prepublish.sh');
        },

        clientfiles: function() {
            this.mkdir(this.clientFolder);
            this.mkdir(this.clientFolder + '/styles');
            this.mkdir(this.clientFolder + '/scripts');
            this.mkdir(this.clientFolder + '/images');
            this.template('client/_eslintrc', this.clientFolder + '/.eslintrc');
            this.template('client/index.html', this.clientFolder + '/index.html');
            this.template('client/404.html', this.clientFolder + '/404.html');
            this.template('client/robots.txt', this.clientFolder + '/robots.txt');
            this.template('client/favicon.ico', this.clientFolder + '/favicon.ico');
            this.template('client/styles/main.scss', this.clientFolder + '/styles/main.scss');
            this.template('client/scripts/main.js', this.clientFolder + '/scripts/main.js');
            this.template('client/scripts/main.test.js', this.clientFolder + '/scripts/main.test.js');
        },

        testFiles: function() {
            this.mkdir('test');
            this.mkdir('test/mocha');
            this.mkdir('test/mocha/helpers');
            this.mkdir('test/e2e');
            this.template('test/e2e/e2e.test.js');
            this.template('test/e2e/_eslintrc', 'test/e2e/.eslintrc');
            this.template('test/mocha/helpers/globals.js', 'test/mocha/helpers/globals.js');
        },

        serverfiles: function() {
            this.mkdir('server');
        }
    },

    install: function() {

    },

    end: function() {
        this.installDependencies({
            skipInstall: this.options['skip-install'],
            skipMessage: this.options['skip-message']
        });
    }
});

module.exports = AppGenerator;