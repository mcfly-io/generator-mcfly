'use strict';
 /*eslint consistent-this:[2,  "<%= directivename %>Ctrl"] */
var directivename = '<%= directivename %>';

module.exports = function(app) {

    // controller
    var controllerDeps = [];
    var controller = function() {
        var <%= directivename %>Ctrl = this;
        <%= directivename %>Ctrl.directivename = directivename;
    };
    controller.$inject = controllerDeps;

    /*eslint-disable consistent-this */

    // directive
    var directiveDeps = [];
    var directive = function() {
        return {
            restrict: 'AE',
            scope: {
                title: '@' // '@' reads attribute value, '=' provides 2-way binding, '&" works with functions
            },
            controller: controller,
            controllerAs: '<%= directivename %>Ctrl',
            bindToController: true,
            template: require('./<%= filename %>.html'),
            link: function(scope, element, attrs) {

            }
        };
    };
    directive.$inject = directiveDeps;

    app.directive(directivename, directive);
};