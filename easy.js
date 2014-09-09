'use strict';
var yeoman = require('yeoman-generator');
var updateNotifier = require('update-notifier');
var Base = yeoman.generators.Base;

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

    },

    add: function(a, b) {
        return a + b;
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
                process.exit(1);
            }
        }
    }
});