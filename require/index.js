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

    },

    //making sure the generator is not empty
    dummy: function() {

    }

});

module.exports = RequireGenerator;