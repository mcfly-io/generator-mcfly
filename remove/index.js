'use strict';
var Class = require('../class');
var gmux = require('gulp-mux');
var del = require('del');
var path = require('path');
var fs = require('fs');
var chalk = require('chalk');

var RemoveGenerator = Class.extend({
    constructor: function() {
        Class.apply(this, arguments);
        this.clientFolder = this.getClientFolder();
        var that = this;
        this.on('end', function() {
            var done = that.async();
            done();
        });
    },

    prompting: {
        askFor: function() {
            var done = this.async();
            this.clientFolder = this.config.get('clientFolder');
            this.targetDir = path.join(process.cwd(), this.clientFolder);

            gmux.targets.setClientFolder(this.clientFolder);
            var targets = gmux.targets.getAllTargets();

            var prompts = [{
                name: 'component',
                message: 'What component would you like to remove?',
                type: 'list',
                choices: ['target']
            }, {
                name: 'targetname',
                type: 'list',
                choices: targets,
                when: function(answers) {
                    var result = answers.component === 'target';
                    return result;
                },
                message: 'What is the name of the target application to remove?',
                default: targets && targets.length >= 1 ? targets[0].value : null
            }, {
                message: 'Are you sure you want to remove it? There is no turning back...',
                name: 'confirmation',
                type: 'confirm',
                default: false
            }];

            this.prompt(prompts, function(answers) {
                this.component = answers.component;
                this.targetname = answers.targetname;
                this.confirmation = answers.confirmation;

                done();
            }.bind(this));
        }
    },
    //making sure the generator is not empty
    remove: function() {
        var done = this.async;
        var that = this;
        var files = [];

        if (this.confirmation !== true) {
            done();
            return;
        }

        var isMobile = exports.isMobile = function(clientFolder, suffix) {
            return fs.existsSync('./' + clientFolder + '/config' + suffix + '.xml');
        };

        if (this.component === 'target') {
            this.suffix = gmux.targets.targetToSuffix(this.targetname);

            files.push(path.join(this.targetDir, 'index' + this.suffix + '.html'));
            files.push(path.join(this.targetDir, 'images', this.targetname));
            files.push(path.join(this.targetDir, 'icons', this.targetname));
            files.push(path.join(this.targetDir, 'fonts', this.targetname));
            if (isMobile(this.clientFolder, this.suffix)) {
                files.push(path.join(this.targetDir, 'config' + this.suffix + '.xml'));
                files.push(path.join(this.targetDir, 'cordova', this.targetname, 'hooks'));
            }
            files.push(path.join(this.targetDir, 'scripts/main' + this.suffix + '.js'));
            files.push(path.join(this.targetDir, 'scripts/main' + this.suffix + '.test.js'));
            files.push(path.join(this.targetDir, 'styles/main' + this.suffix + '.scss'));
            files.push(path.join(this.targetDir, '404' + this.suffix + '.html'));
            files.push(path.join(this.targetDir, 'robots' + this.suffix + '.txt'));
            files.push(path.join(this.targetDir, 'favicon' + this.suffix + '.ico'));

            del(files, function(err, deletedFiles) {
                if (err) {
                    that.log(chalk.red.bold('(ERROR) '), err);
                } else {
                    that.log('Files deleted:\n' + deletedFiles.join('\n'));
                }
                done();
            });

        }
    }

});

module.exports = RemoveGenerator;