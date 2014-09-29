'use strict';
var servicename = '<%= servicename %>';

module.exports = function(app) {

    app.factory(app.name + '.' + servicename, <%= servicename %>); 

    <%= servicename %>.$inject = [];

    function <%= servicename %>() {
        var service = {
            add: add
        };
        return service;
        //////////////////

        function add(a, b) {
            return a + b;
        }
    };
};