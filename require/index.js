'use strict';
var Class = require('../class');

var RequireGenerator = Class.extend({
    constructor: function() {
        Class.apply(this, arguments);
        this.clientFolder = this.getClientFolder();
        var that = this;
        this.on('end', function() {
            var done = that.async();
            this.injectAll().
            finally(done);
        });

        this.createOptions();

    },

    end: function() {

    }

});

module.exports = RequireGenerator;