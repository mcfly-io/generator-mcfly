'use strict';
var filtername = '<%= filtername %>';

module.exports = function(app) {

    var deps = [];

    function filter() {
        return function(item) {
            return item.toLowerCase();
        };
    }

    filter.$inject = deps;
    app.filter(filtername, filter);
};