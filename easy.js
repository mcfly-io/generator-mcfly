'use strict';
var yeoman = require('yeoman-generator');

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
    }
});