'use strict';
//var util = require('util');
var path = require('path');
var _ = require('lodash');
var Class = require('../class');

var ServiceGenerator = Class.extend({
    constructor: function() {

        Class.apply(this, arguments);
        this.createOptions();

        this.argument('modulename', {
            type: String,
            required: false
        });

        this.argument('servicename', {
            type: String,
            required: false
        });
        this.modulename = this._.camelize(this._.slugify(this._.humanize(this.modulename)));
        this.servicename = this._.camelize(this._.slugify(this._.humanize(this.servicename)));
    },

    initializing: function() {
        var done = this.async();
        var that = this;
        this.clientModules = [];
        this.getClientModules()
            .then(function(modules) {
                that.clientModules = modules;
                done();
            }, function() {
                done();
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
            name: 'servicename',
            when: function() {
                return !that.servicename || that.servicename.length <= 0;
            },
            message: 'How would like to name your service ?',
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
            that.servicename = that.servicename || answers.servicename;
            done();
        });

    },

    configuring: function() {

    },

    writing: function() {
        this.sourceRoot(path.join(__dirname, '../templates/service'));
        var targetDir = path.join('client', 'scripts', this.modulename, 'services');
        this.mkdir(targetDir);
        this.template('index.js', path.join(targetDir, this.servicename + '.js'));
    },

    end: function() {

    }
});

module.exports = ServiceGenerator;