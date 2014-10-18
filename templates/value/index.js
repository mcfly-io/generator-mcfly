'use strict';
var valuename = '<%= valuename %>';

module.exports = function(app) {
    app.value(app.name + '.' + valuename, {});
};