'use strict';

var Class = require('../class/component.js')('values', 'value');

var ValueGenerator = Class.extend({
    constructor: function() {

        Class.apply(this, arguments);

        this.argument('valuename', {
            type: String,
            required: false
        });

        this.valuename = this.camelize(this.valuename);
    },

    initializing: function() {
        ValueGenerator.__super__.initializing.apply(this, arguments);
    },

    prompting: function() {

        var done = this.async();
        ValueGenerator.__super__.prompting.call(this, done);
    },

    configuring: function() {

    },

    writing: function() {
        ValueGenerator.__super__.writing.apply(this, arguments);

    },

    end: function() {

    }
});

module.exports = ValueGenerator;