'use strict';

var Class = require('../class/component.js')('constants', 'constant');

var ConstantGenerator = Class.extend({
    constructor: function() {

        Class.apply(this, arguments);

        this.argument('constantname', {
            type: String,
            required: false
        });

        this.constantname = this.camelize(this.constantname);
    },

    initializing: function() {
        ConstantGenerator.__super__.initializing.apply(this, arguments);
    },

    prompting: function() {

        var done = this.async();
        ConstantGenerator.__super__.prompting.call(this, done);
    },

    configuring: function() {

    },

    writing: function() {
        ConstantGenerator.__super__.writing.apply(this, arguments);

    }
});

module.exports = ConstantGenerator;