'use strict';
global.Promise = require('bluebird');
var generators = require('yeoman-generator');
var updateNotifier = require('update-notifier');
var Base = generators.Base;
var shell = require('shelljs');
var chalk = require('chalk');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var globToRegexp = require('glob-to-regexp');
var utils = require('../utils.js');
var subcomponents = require('./subcomponents.js');
var mkdirp = require('mkdirp');
/**
 * The `Class` generator has several helpers method to help with creating a new generator.
 * It can be used in place of the `Base` generator
 * @augments Base
 * @alias Easy
 */
var ClassGenerator = Base.extend({

    /**
     * Ctor
     * @constructor
     */
    constructor: function() {
        Base.apply(this, arguments);
        this.utils = {};
        this.travisOptions = {
            version: '1.7.2'
        };
        this.utils.shell = shell;
        this.utils.updateNotifier = updateNotifier;
        this.utils.chalk = chalk;
        this.utils.mkdir = mkdirp.sync.bind(mkdirp);
        this.utils._ = _;
    },

    /**
     * Create the standard basic options
     */
    createOptions: function() {
        this.option('check-travis', {
            desc: 'Check if travis cli is installed',
            type: 'Boolean',
            defaults: true
        });

        this.option('check-git', {
            desc: 'Check if git cli is installed',
            type: 'Boolean',
            defaults: true
        });

        this.option('skip-welcome-message', {
            desc: 'Skip the welcome message',
            type: 'Boolean',
            defaults: false
        });

    },

    /**
     * Check if a command line utility is installed
     * @private
     * @param {String} cmd - The name of the command line utility (example : git)
     * @param {Boolean} exit - true if process should exit, false otherwise, defaults to false
     * @returns {Q.promise} - A promise returning undefined if check was skipped, false if not installed or true if installed
     */
    checkCmd: function(cmd, exit) {
        exit = exit !== false;

        return new Promise(function(resolve, reject) {

            if (this.options['check-' + cmd] === false) {
                resolve(undefined);
            }

            if (!this.utils.shell.which(cmd)) {
                this.log(chalk.red.bold('(ERROR)') + ' It looks like you do not have ' + cmd + ' installed...');
                if (exit === true) {
                    reject(new Error(cmd + ' is missing'));
                    this.utils.shell.exit(1);
                } else {
                    resolve(false);
                }

            } else {
                this.log(chalk.gray(cmd + ' is installed, continuing...\n'));
                resolve(true);
            }

        }.bind(this));
    },

    /**
     * Check if git is installed
     * @returns {Q.promise} - A promise returning undefined if check was skipped, false if not installed or true if installed
     */
    checkGit: function() {
        return this.checkCmd('git', true);

    },

    /**
     * Check if travis is installed
     * @returns {Q.promise} - A promise returning undefined if check was skipped, false if not installed or true if installed
     */
    checkTravis: function() {
        return this.checkCmd('travis', false)
            .then(function(value) {
                if (value === false) {
                    this.utils.shell.exec('gem install travis -v' + this.travisOptions.version + ' --no-rdoc --no-ri');
                    return true;
                }
                return value;
            }.bind(this));
    },

    /**
     * Check if Python is installed
     * @returns {Q.promise} - A promise returning undefined if check was skipped, false if  not installed or true if installed
     */
    checkPython: function() {
        return this.checkCmd('python', true);
    },

    notifyUpdate: function(pkg) {
        var notifier = this.utils.updateNotifier({
            packageName: pkg.name,
            packageVersion: pkg.version,
            updateCheckInterval: 1
        });
        if (notifier.update) {
            if (notifier.update.latest !== pkg.version) {
                notifier.notify();
                //this.utils.shell.exit(1);
            }
        }
    },

    hasListOption: function(answers, list, option) {
        if (!answers || !answers[list]) {
            return false;
        }
        return answers[list].indexOf(option) !== -1;
    },

    choicesToProperties: function(answers, choices, name) {
        choices.forEach(function(choice) {
            this[choice.value] = this.hasListOption(answers, name, choice.value);
        }.bind(this));
    },

    /**
     * Get the list of directories or files given a path (Promise)
     * @param {String} dirPath - The path to start looking for sub directories
     * @param {Boolean} isDirectory - true to retreive directories, false to retreive files
     * @private
     * @returns {String[]} - An array of sub directories names
     */
    readDir: function(dirPath, isDirectory) {
        return new Promise(function(resolve, reject) {
            fs.readdir(dirPath, function(err, files) {
                if (err) {
                    reject(err);
                } else {

                    var result = files.filter(function(file) {
                        return fs.statSync(path.join(dirPath, file)).isDirectory() === isDirectory;
                    });
                    resolve(result);
                }
            });

        });
    },

    /**
     * Clean & camelize a string
     * @param {String} str - The original string
     * @returns {String} - The camelized string
     */
    camelize: function(str) {
        return _.camelCase(_.snakeCase(str));
    },

    /**
     * Clean & dasherize a string
     * @param {String} str - The original string
     * @returns {String} - The dasherized string
     */
    dasherize: function(str) {
        return _.snakeCase(this.camelize(str));
    },

    /**
     * Get the string back with the correct file casing as defined by filenameCase
     * @param {String} str - The original string
     * @returns {String} - A string with the correct casing (i.e. camelCase, snake-case)
     */
    casify: function(str) {
        var filenameCase = this.config.get('filenameCase') || 'camel';
        str = this.camelize(str);
        if (filenameCase === 'snake') {
            return this.dasherize(str);
        }
        return str;
    },

    /**
     * Append the component type suffix if filenameSuffix is set to true in the .yo-rc.json
     * @param {String} str - The original string
     * @param {String} suffix - The name of the component's type to append
     * @returns {String} - Either str or str with the suffix appended. (i.e. 'homeCtrl' vs 'homeCtrl.controller')
     */
    suffixify: function(str, suffix) {
        var filenameSuffix = this.config.get('filenameSuffix');
        if (filenameSuffix === true || filenameSuffix === 'true') {
            return str + '.' + suffix;
        }
        return str;
    },

    /**
     * Get the list of directories given a path (Promise)
     * @param {String} dirPath - The path to start looking for sub directories
     * @returns {String[]} - An array of sub directories names
     */
    getDirectories: function(dirPath) {
        return this.readDir(dirPath, true);
    },

    /**
     * Get the list of directories given a path (Promise)
     * @param {String} dirPath - The path to start looking for sub diretories
     * @returns {String[]} - An array of sub directories names
     */
    getFiles: function(dirPath) {
        return this.readDir(dirPath, false);
    },

    /**
     * Return the list of angularjs client modules (Promise)
     * @returns {String[]} - An array of client modules
     */
    getClientModules: function() {
        return this.getDirectories(this.getClientScriptFolder());
    },

    /**
     * Return the client script folder
     * @returns {String} - The path of the client script folder
     */
    getClientScriptFolder: function() {
        return path.join(this.destinationRoot(), this.clientFolder, 'scripts');
    },

    /**
     * Return the client folder from .yo-rc.json file, or create it
     * @returns {String} - The name of the client folder
     */
    getClientFolder: function() {
        var retval = this.config.get('clientFolder');
        if (!retval) {
            retval = 'client';
            this.config.set('clientFolder', retval);
            this.config.save();
        }
        return retval;
    },

    /**
     * Return the list of client targets (Promise)
     * @returns {String[]} - An array of client targets
     */
    getClientTargets: function() {
        var re = globToRegexp('{index-*.html,index.html}', {
            extended: true
        });
        return this
            .getFiles(path.join(this.destinationRoot(), this.clientFolder))
            .then(function(files) {
                var result = _(files)
                    .filter(function(name) {
                        return re.test(name);
                    })
                    .map(function(name) {
                        var appname = path.basename(name, '.html');
                        appname = appname === 'index' ? 'app' : _(appname.split('-')).last();
                        return appname;
                    })
                    .value();
                return result;
            });

    },

    /**
     * Converts the target name application to suffix
     * @param {String} targetname - The name of the target application
     *
     * @returns {String} - The suffix name of the target application
     */
    targetnameToSuffix: function(targetname) {
        return targetname === 'app' ? '' : '-' + targetname;
    },

    /**
     * Inject all modules in all targets applications
     * @returns {Promise} - A promise after the injection is done
     */
    injectAllModules: function() {
        var directory;
        var modules;
        var targets;
        var that = this;
        this.skipInjectModules = this.options['skip-inject-modules'];
        if (this.skipInjectModules) {
            return Promise.resolve(null);
        }
        return Promise.all([this.getClientScriptFolder(), this.getClientModules(), this.getClientTargets()])
            .then(function(values) {
                directory = values[0];
                modules = values[1];
                targets = values[2];
            }).then(function() {

                if (targets && targets.length > 0) {
                    var tasks = _(targets).map(function(target) {
                        var suffix = that.targetnameToSuffix(target);
                        return utils.injectModules(directory, suffix, modules);
                    }).value();
                    return Promise.all(tasks);
                } else {
                    return null;
                }
            });
    },

    /**
     * Inject the all list of angular components as well as their sub compnents
     * @returns {Promise} - A promise
     */
    injectAllComponents: function() {
        var directory;
        var modules;
        var that = this;
        return Promise.all([this.getClientScriptFolder(), this.getClientModules()])
            .then(function(values) {
                directory = values[0];
                modules = values[1];
            })
            .then(function() {
                var tasks = [];
                modules.forEach(function(module) {
                    tasks.push(utils.injectSubComponent(that, path.join(directory, module)));
                    subcomponents.forEach(function(localfolder) {
                        tasks.push(utils.injectComponent(path.join(directory, module, localfolder)));
                    });
                });

                return Promise.all(tasks);
            });
    },

    /**
     * Run the injection for the whole project
     * @returns {Promise} - A promise
     */
    injectAll: function() {
        return Promise.all([this.injectAllModules(), this.injectAllComponents()]);
    }

});

module.exports = ClassGenerator;
