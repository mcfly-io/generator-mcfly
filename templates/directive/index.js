'use strict';
var directivename = '<%= directivename %>';

module.exports = function(app) {

    // controller
    var controllerDeps = [];
    var controller = function() {

    };
    controller.$inject = controllerDeps;

    // directive
    var directiveDeps = [];
    var directive = function() {
        return {
            restrict: 'AEC',
            replace: true,
            scope: {
                title: '@' // '@' reads attribute value, '=' provides 2-way binding, '&" works with functions
            },
            controller: controller,
            template: require('./<%= directivename %>.html'),
            link: function($scope, element, attrs) {

            }
        };
    };
    directive.$inject = directiveDeps;

    app.directive(directivename, directive);
};