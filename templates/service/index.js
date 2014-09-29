'use strict';
var serviceName = '<%= servicename %>';

module.exports = function(app) {

    app.factory(app.name + '.' + servicename, function() {
        return {};
    });

};