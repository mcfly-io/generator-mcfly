'use strict';
var yeoman = require('yeoman-generator');
var updateNotifier = require('update-notifier');
var Base = yeoman.generators.Base;
var shell = require('shelljs');
var chalk = require('chalk');
/**
 * The `Easy` generator has several helpers method to help with creating a new generator.
 *
 * It can be used in place of the `Base` generator
 *
 * @constructor
 * @augments Base
 * @alias Easy
 */
module.exports = Base.extend({

    constructor: function() {
        Base.apply(this, arguments);
        this.travisOptions = {
            version: '1.7.1'
        };
    },

    add: function(a, b) {
        return a + b;
    },

    checkCmd: function(cmd, callback) {
        if(!shell.which(cmd)) {
            this.log(chalk.red.bold('(ERROR)') + ' It looks like you do not have ' + cmd + ' installed...');
            if(callback && callback() !== true) {
                this.log('please install ' + cmd + ' and try again.');
                shell.exit(1);
            }
        } else {
            this.log(chalk.gray(cmd + ' is installed, continuing...\n'));
        }
    },

    checkGit: function() {
        this.checkCmd('git');
    },

    checkTravis: function() {
        this.checkCmd('travis', function() {
            shell.exec('gem install travis -v' + this.travisOptions.version + ' --no-rdoc --no-ri');
            return false;
        });
    },

    updateNotifier: function() {
        this.pkg = require('../package.json');
        var notifier = updateNotifier({
            packageName: this.pkg.name,
            packageVersion: this.pkg.version,
            updateCheckInterval: 1
        });
        if(notifier.update) {
            if(notifier.update.latest !== this.pkg.version) {
                notifier.notify();
                shell.exit(1);
            }
        }
    }
});