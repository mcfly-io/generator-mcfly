'use strict';

var path = require('path');
var _ = require('lodash');
var _str = require('underscore.string');
var utils = require('../utils');
var Class = require('../class');

var ServiceGenerator = Class.extend({
    constructor: function() {

        Class.apply(this, arguments);
        this.clientFolder = this.getClientFolder();
        var that = this;
        this.on('end', function() {
            var done = that.async();
            utils.injectComponent(path.join(that.getClientScriptFolder(), that.moduleFolder, 'services'))
                .then(function() {
                    return utils.injectSubComponent(that, path.join(that.getClientScriptFolder(), that.moduleFolder));
                })
                .then(function() {
                    done();
                });
        });

        this.createOptions();

        this.option('servicetype', {
            desc: 'service type (service, factory, provider)',
            type: 'String',
            alias: 'type'
        });

        this.argument('modulename', {
            type: String,
            required: false
        });

        this.argument('servicename', {
            type: String,
            required: false
        });
        this.modulename = this.camelize(this.modulename);
        this.moduleFolder = this.casify(this.modulename);
        this.servicename = this.camelize(this.servicename);

        this.servicetype = this.options.servicetype || this.options.type || 'factory';

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

        var serviceTypes = ['service', 'factory', 'provider'];

        if (!_.contains(serviceTypes, that.servicetype)) {
            that.log(that.utils.chalk.red('Invalid service type. The possible values are : ' + serviceTypes.join(', ')));
            that.emit('error', 'Invalid service type');
            /*eslint no-process-exit:0 */
            //process.exit();
            done();
        }

        this.getClientModules()
            .then(function(modules) {
                if (!_.isArray(modules) || modules.length <= 0) {
                    emitError();
                }
                that.clientModules = modules;
                done();
            }, function() {
                emitError();
            });
    },

    prompting: function() {
        var done = this.async();
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
                value = _str.trim(value);
                if (_.isEmpty(value) || value[0] === '/' || value[0] === '\\') {
                    return 'Please enter a non empty name';
                }
                if (!_.contains(that.clientModules, value)) {
                    return 'The module name ' + value + ' does not exist';
                }
                return true;
            }
        }, {
            name: 'servicename',
            when: function() {
                return !that.servicename || that.servicename.length <= 0;
            },
            message: 'How would like to name your service ?',
            validate: function(value) {
                value = _str.trim(value);
                if (_.isEmpty(value) || value[0] === '/' || value[0] === '\\') {
                    return 'Please enter a non empty name';
                }
                return true;
            }
        }];

        this.prompt(prompts, function(answers) {
            that.modulename = that.modulename || answers.modulename;
            that.modulename = that.camelize(that.modulename);
            that.moduleFolder = that.casify(that.modulename);
            that.servicename = that.servicename || answers.servicename;
            done();
        });

    },

    configuring: function() {

    },

    writing: function() {
        if (!_.contains(this.clientModules, this.moduleFolder)) {
            this.log(this.utils.chalk.red('Error: ') + 'The module name ' + this.utils.chalk.yellow(this.modulename) + ' does not exist');
            return;
        }
        var done = this.async();
        this.sourceRoot(path.join(__dirname, '../templates/service'));
        var targetDir = path.join(this.clientFolder, 'scripts', this.moduleFolder, 'services');
        this.utils.mkdir(targetDir);

        // make sure the services/index.js exist
        utils.createIndexFile(this, '../component', targetDir);
        var filename = this.casify(this.servicename);
        filename = this.suffixify(filename, 'service');

        this.template('index.' + this.servicetype + '.js', path.join(targetDir, filename + '.js'));
        this.template('index.test.js', path.join(targetDir, filename + '.test.js'));
        done();

    },

    end: function() {

    }
});

module.exports = ServiceGenerator;
