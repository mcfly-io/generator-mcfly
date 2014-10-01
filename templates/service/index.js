'use strict';
var servicename = '<%= servicename %>';

module.exports = function(app) {

    var dependencies = [];
    function <%= servicename %>() {

        var add = function(a, b) {
            return a + b;
        };

        return {
            add : add
        };
    }

    <%= servicename %>.$inject = dependencies;
    app.factory(app.name + '.' + servicename, <%= servicename %>);

};