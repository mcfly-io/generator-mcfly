'use strict';

var Class = require('../class/component.js')('filters', 'filter');

var FilterGenerator = Class.extend({
    constructor: function() {

        Class.apply(this, arguments);

        this.argument('filtername', {
            type: String,
            required: false
        });

        this.filtername = this._.camelize(this._.slugify(this._.humanize(this.filtername)));
    },

    initializing: function() {
        FilterGenerator.__super__.initializing.apply(this, arguments);
    },

    prompting: function() {

        var done = this.async();
        FilterGenerator.__super__.prompting.call(this, done);
    },

    configuring: function() {

    },

    writing: function() {
        FilterGenerator.__super__.writing.apply(this, arguments);

    },

    end: function() {

    }
});

module.exports = FilterGenerator;