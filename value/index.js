'use strict';

var Class = require('../class/component.js')('values', 'value');

var ConstantGenerator = Class.extend({
    constructor: function() {

        Class.apply(this, arguments);

        this.argument('valuename', {
            type: String,
            required: false
        });

        this.valuename = this._.camelize(this._.slugify(this._.humanize(this.valuename)));
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

    },

    end: function() {

    }
});

module.exports = ConstantGenerator;