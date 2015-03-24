'use strict';

var Class = require('../class/component.js')('controllers', 'controller');

var ControllerGenerator = Class.extend({
    constructor: function() {

        Class.apply(this, arguments);

        this.argument('controllername', {
            type: String,
            required: false
        });

        this.controllername = this.camelize(this.controllername);
    },

    initializing: function() {
        ControllerGenerator.__super__.initializing.apply(this, arguments);
    },

    prompting: function() {

        var done = this.async();
        ControllerGenerator.__super__.prompting.call(this, done);
    },

    configuring: function() {

    },

    writing: function() {
        ControllerGenerator.__super__.writing.apply(this, arguments);

    }
});

module.exports = ControllerGenerator;