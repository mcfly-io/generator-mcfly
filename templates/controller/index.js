'use strict';
var controllername = '<%= controllername %>';

module.exports = function(app) {
    /*jshint validthis: true */

    var deps = [];

    function <%= controllername %>() {
        var vm = this;
        vm.message = 'Hello World';
        var activate = function() {

        };
        activate();
    }

    <%= controllername %>.$inject = deps;
    app.controller(app.name + '.' + controllername, <%= controllername %>);
};