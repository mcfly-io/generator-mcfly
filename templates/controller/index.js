'use strict';
var controllername = '<%= controllername %>';

module.exports = function(app) {
    var fullname = app.name + '.' + controllername;
    /*jshint validthis: true */

    var deps = [];

    function controller() {
        var vm = this;
        vm.message = 'Hello World';
        vm.controllerName = fullname;

        var activate = function() {

        };
        activate();
    }

    controller.$inject = deps;
    app.controller(fullname, controller);
};
