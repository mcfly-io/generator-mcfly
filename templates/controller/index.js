'use strict';
var controllername = '<%= controllername %>';

module.exports = function(app) {

    app.factory(app.name + '.' + controllername, <%= controllername %>);

    <%= controllername %>.$inject = [];

    function <%= controllername %>() {
        var vm = this;

        activate();

        function activate() {

        }

    };
};