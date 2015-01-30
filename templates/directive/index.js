'use strict';
 /*eslint consistent-this:[2,  "<%= directivename %>"] */
var directivename = '<%= directivename %>';

module.exports = function(app) {

    // controller
    var controllerDeps = [];
    var controller = function() {
        var <% directivename %> = this;
    };
    controller.$inject = controllerDeps;

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
            template: require('./<%= directivename %>.html'),
            link: function(scope, element, attrs) {

            }
        };
    };
    directive.$inject = directiveDeps;

    app.directive(directivename, directive);
};