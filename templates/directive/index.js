'use strict';
var directivename = '<%= directivename %>';

module.exports = function(app) {

    var deps = [];
    var controller = function() {

    };
    controller.$inject = deps;

    function directive() {
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
    }

    app.directive(directivename, directive);
};