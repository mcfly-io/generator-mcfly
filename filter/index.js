'use strict';

var path = require('path');
var _ = require('lodash');
var utils = require('../utils');
var Class = require('../class');

var FilterGenerator = Class.extend({
    constructor: function() {

        Class.apply(this, arguments);
        var that = this;
        this.on('end', function() {
            var done = that.async();
            utils.injectComponent(path.join(that.getClientScriptFolder(), that.modulename, 'filters'))
                .then(function() {
                    return utils.injectSubComponent(that, path.join(that.getClientScriptFolder(), that.modulename));
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

        this.argument('filtername', {
            type: String,
            required: false
        });
        this.modulename = this._.camelize(this._.slugify(this._.humanize(this.modulename)));
        this.filtername = this._.camelize(this._.slugify(this._.humanize(this.filtername)));
    },

    initializing: function() {
        var done = this.async();
        var that = this;
        this.clientModules = [];
        var emitError = function() {
            that.log(that.utils.chalk.red('No module could be found. Please run \'yo angular-famous-ionic:module\' to create one.'));
            that.emit('error', 'No module found');
            done();
        };
        this.getClientModules()
            .then(function(modules) {
                if(!_.isArray(modules) || modules.length <= 0) {
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
            default: that.modulename,
            validate: function(value) {
                value = _.str.trim(value);
                if(_.isEmpty(value) || value[0] === '/' || value[0] === '\\') {
                    return 'Please enter a non empty name';
                }
                if(!_.contains(that.clientModules, value)) {
                    return 'The module name ' + value + ' does not exist';
                }
                return true;
            }
        }, {
            name: 'filtername',
            when: function() {
                return !that.filtername || that.filtername.length <= 0;
            },
            message: 'How would like to name your filter ?',
            validate: function(value) {
                value = _.str.trim(value);
                if(_.isEmpty(value) || value[0] === '/' || value[0] === '\\') {
                    return 'Please enter a non empty name';
                }
                return true;
            }
        }];

        this.prompt(prompts, function(answers) {
            that.modulename = that.modulename || answers.modulename;
            that.filtername = that.filtername || answers.filtername;
            done();
        });

    },

    configuring: function() {

    },

    writing: function() {
        var done = this.async();
        this.sourceRoot(path.join(__dirname, '../templates/filter'));
        var targetDir = path.join('client', 'scripts', this.modulename, 'filters');
        this.mkdir(targetDir);

        // make sure the fitlers/index.js exist
        utils.createIndexFile(this, '../component', targetDir);

        this.template('index.js', path.join(targetDir, this.filtername + '.js'));
        this.template('index.test.js', path.join(targetDir, this.filtername + '.test.js'));
        done();

    },

    end: function() {

    }
});

module.exports = FilterGenerator;