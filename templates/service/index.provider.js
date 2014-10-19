'use strict';
var servicename = '<%= servicename %>';

module.exports = function(app) {

    var dependencies = [];

    function service() {
        var isInitialized = false;
        var init = function() {
            isInitialized = true;
        };
        return {
            // initialization
            init: init,

            $get: ['$q',
                function($q) {
                    var add = function(a, b) {
                        return a + b;
                    };

                    return {
                        isInitialized: isInitialized,
                        add: add
                    };
                }
            ]
        };

    }
    service.$inject = dependencies;

    app.provider(app.name + '.' + servicename, service);
};