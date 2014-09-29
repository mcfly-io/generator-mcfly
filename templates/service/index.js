'use strict';
var serviceName = '<%= this.servicename %>';

module.exports = function(app) {

    app.factory(app.name + '.' + servicename, function() {
        return {};
    });

};