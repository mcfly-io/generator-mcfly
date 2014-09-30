'use strict';
var controllername = '<%= controllername %>';

module.exports = function(app) {
    /*jshint validthis: true */
    app.controller(app.name + '.' + controllername, <%= controllername %>);

    <%= controllername %>.$inject = [];

    function <%= controllername %>() {
        var vm = this;

        activate();

        function activate() {

        }

    };
};