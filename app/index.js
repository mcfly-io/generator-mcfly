'use strict';
//var util = require('util');
//var path = require('path');
var chalk = require('chalk');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var shell = require('shelljs');
var Easy = require('../class');
var AngularFamousIonicGenerator = Easy.extend({
    constructor: function() {
        yeoman.generators.Base.apply(this, arguments);
        this.createOptions();
    },

    initializing: function() {
        this.pkg = require('../package.json');
        this.checkGit();
        this.checkTravis();

    },

    prompting: {
        welcome: function() {
            // Have Yeoman greet the user.
            if(!this.options.hideWelcome) {
                this.log(yosay('Welcome to the bedazzling AngularFamousIonic generator!'));
            }
            this.composeWith('sublime:app');
            // check if travis is installed
            if(this.options.checkTravis) {
                if(!this.shell.which('travis')) {
                    this.log(chalk.red.bold('\nCould not find travis cli... ' +
                        '\nPlease install it manually using the following command : '
                    ) + chalk.yellow.bold('\ngem install travis -v' + this.travisOptions.version + ' --no-rdoc --no-ri'));
                    shell.exit(1);
                } else {
                    this.log(chalk.gray('travis is installed, continuing...\n'));
                }
            }
        }
    },

    prompting2: function() {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the bedazzling AngularFamousIonic generator!'
        ));

        var prompts = [{
            type: 'confirm',
            name: 'someOption',
            message: 'Would you like to enable this option?',
            default: true
        }];

        this.prompt(prompts, function(props) {
            this.someOption = props.someOption;

            done();
        }.bind(this));
    },

    writing: {
        app: function() {
            this.dest.mkdir('app');
            this.dest.mkdir('app/templates');

            this.src.copy('_package.json', 'package.json');
            this.src.copy('_bower.json', 'bower.json');
        },

        projectfiles: function() {
            this.src.copy('editorconfig', '.editorconfig');
            this.src.copy('jshintrc', '.jshintrc');
        }
    },

    end: function() {
        this.installDependencies({
            skipInstall: this.options['skip-install'],
            skipMessage: this.options['skip-message']
        });
    }
});

module.exports = AngularFamousIonicGenerator;