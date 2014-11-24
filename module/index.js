'use strict';

var path = require('path');
var _ = require('lodash');
var Class = require('../class');
var utils = require('../utils');

var ModuleGenerator = Class.extend({
    constructor: function() {
        Class.apply(this, arguments);
        this.createOptions();

        this.argument('modulename', {
            type: String,
            required: false
        });
        this.modulename = this._.camelize(this._.slugify(this._.humanize(this.modulename)));
        this.clientFolder = this.getClientFolder();
        this.ionic = this.config.get('ionic');
        this.famous = this.config.get('famous');
        this.ngCordova = this.config.get('ngCordova');
        this.ngModules = utils.getNgModules(this);
    },

    initializing: function() {
        var done = this.async();
        Class.prototype.afterInitializing = function() {
            // for unit test only
        };

        var that = this;
        this.clientModules = [];
        this.getClientModules()
            .then(function(modules) {
                that.clientModules = modules;
                that.afterInitializing();
                done();
            }, function() {
                that.emit('error', 'No module found');
                done();
            });
    },

    prompting: function() {

        var done = this.async();
        var that = this;
        var prompts = [{
            name: 'modulename',
            when: function() {
                return !that.modulename || that.modulename.length <= 0;
            },
            message: 'What is the name of your module ?',
            default: this.modulename,
            validate: function(value) {
                value = _.str.trim(value);
                if(_.isEmpty(value) || value[0] === '/' || value[0] === '\\') {
                    return 'Please enter a non empty name';
                }
                if(_.contains(that.clientModules, value)) {
                    return 'The module name ' + value + ' already exists';
                }
                return true;
            }
        }];

        this.prompt(prompts, function(answers) {
            this.modulename = this.modulename || answers.modulename;
            done();
        }.bind(this));

    },

    configuring: function() {
        if(_.contains(this.clientModules, this.modulename)) {
            var msg = 'The module name ' + this.modulename + ' already exists';
            this.log(this.utils.chalk.red.bold('(ERROR) ') + msg);
            var error = new Error(msg);
            this.emit('error', error);
        }
    },

    writing: {

        getComponents: function() {
            var done = this.async();
            this.sourceDir = path.join(__dirname, '../templates/module');
            this.sourceRoot(this.sourceDir);
            this.targetDir = path.join(process.cwd(), this.clientFolder, 'scripts', this.modulename);
            this.mkdir(this.targetDir);
            this.template('index.js', path.join(this.targetDir, 'index.js'));
            this.template('home.html', path.join(this.targetDir, 'views', 'home.html'));
            done();
        }
    },

    end: function() {
        var done = this.async();
        this.clientModules.push(this.modulename);
        utils.injectModules(this.getClientScriptFolder(), this.clientModules).then(done);
    }
});

module.exports = ModuleGenerator;