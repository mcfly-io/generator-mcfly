'use strict';
var directivename = '<%= directivename %>';

module.exports = function(app) {

    var controllerDeps = [];
    var controller = function() {

    };

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

    controller.$inject = controllerDeps;
    directive.$inject = directiveDeps;

    app.directive(directivename, directive);
};