/*eslint no-process-exit:0*/
'use strict';

var path = require('path');
var _ = require('lodash');
var utils = require('../utils');
var Class = require('./index.js');
var _localFolder;
var _templateFolder;
var ComponentGenerator = Class.extend({
    constructor: function() {
        Class.apply(this, arguments);
        var that = this;

        that.localFolder = _localFolder;
        that.templateFolder = _templateFolder;
        that.clientFolder = that.getClientFolder();

        that.on('end', function() {
            var done = that.async();
            utils.injectComponent(path.join(that.getClientScriptFolder(), that.moduleFolder, that.localFolder))
                .then(function() {
                    return utils.injectSubComponent(that, path.join(that.getClientScriptFolder(), that.moduleFolder));
                })
                .then(function() {
                    done();
                });
        });

        this.createOptions();

        this.argument('modulename', {
            type: String,
            required: false
        });

        this.modulename = this.camelize(this.modulename);
        this.moduleFolder = this.casify(this.modulename);
    },

    initializing: function() {
        var done = this.async();
        var that = this;
        this.clientModules = [];
        var emitError = function() {
            that.log(that.utils.chalk.red('No module could be found. Please run \'yo mcfly:module\' to create one.'));
            that.emit('error', 'No module found');
            done();
        };
        this.getClientModules()
            .then(function(modules) {
                if (!_.isArray(modules)) {
                    emitError();
                }
                if (modules.length <= 0) {
                    emitError();
                }

                that.clientModules = modules;
                done();
            }, function() {
                emitError();
            });
    },

    prompting: function(done) {

        var that = this;

        var choices = _.map(this.clientModules, function(module) {
            return {
                name: module,
                value: module
            };
        });

        var prompts = [{
            name: 'modulename',
            type: 'list',
            choices: choices,
            when: function() {
                var result = !that.modulename || that.modulename.length <= 0;
                return result;
            },
            message: 'What is the name of your module ?',
            default: that.modulename || (choices && choices.length >= 1 ? choices[0].value : that.modulename),
            validate: function(value) {
                value = _.trim(value);
                if (_.isEmpty(value) || value[0] === '/' || value[0] === '\\') {
                    return 'Please enter a non empty name';
                }
                if (!_.contains(that.clientModules, value)) {
                    return 'The module name ' + value + ' does not exist';
                }
                return true;
            }
        }, {
            name: _templateFolder + 'name',
            when: function() {
                return !that[_templateFolder + 'name'] || that[_templateFolder + 'name'].length <= 0;
            },
            message: 'How would like to name your ' + _templateFolder + ' ?',
            validate: function(value) {

                value = _.trim(value);
                if (_.isEmpty(value) || value[0] === '/' || value[0] === '\\') {
                    that.prompt_errors = 'Please enter a non empty name';
                    return 'Please enter a non empty name';
                }
                return true;
            }
        }];
        this.prompt(prompts, function(answers) {
            that.modulename = that.modulename || answers.modulename;

            that.modulename = that.camelize(that.modulename);
            that.moduleFolder = that.casify(that.modulename);
            that[_templateFolder + 'name'] = that[_templateFolder + 'name'] || answers[_templateFolder + 'name'];
            done();
        });

    },

    writing: function() {
        if (!_.contains(this.clientModules, this.moduleFolder)) {
            this.log(this.utils.chalk.red('Error: ') + 'The module name ' + this.utils.chalk.yellow(this.modulename) + ' does not exist');
            return;
        }
        var done = this.async();
        this.sourceRoot(path.join(__dirname, '../templates/' + this.templateFolder));
        var targetDir = path.join(this.clientFolder, 'scripts', this.moduleFolder, this.localFolder);
        this.utils.mkdir(targetDir);

        // make sure the <component>/index.js exist
        utils.createIndexFile(this, '../component', targetDir);
        var filename = this.casify(this[_templateFolder + 'name']);
        filename = this.suffixify(filename, _templateFolder);
        this.template('index.js', path.join(targetDir, filename + '.js'));
        this.template('index.test.js', path.join(targetDir, filename + '.test.js'));
        done();
    }

});

module.exports = function(localFolder, templateFolder) {
    _localFolder = localFolder;
    _templateFolder = templateFolder;
    return ComponentGenerator;
};
