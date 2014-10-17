'use strict';
var constantname = '<%= constantname %>';

module.exports = function(app) {
    app.constant(app.name + '.' + constantname, {});
};