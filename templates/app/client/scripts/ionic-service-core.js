'use strict';

if (window.Ionic) {
    angular.module('ionic.service.core', [])
        .provider('persistentStorage', function() {
            return {
                '$get': [function() {
                    var storage = window.Ionic.getService('Storage');
                    if (!storage) {
                        storage = new window.Ionic.IO.Storage();
                        window.Ionic.addService('Storage', storage, true);
                    }
                    return storage;
                }]
            };
        }).factory('$ionicCoreSettings', [function() {
            return new window.Ionic.IO.Settings();
        }]).factory('$ionicUser', [function() {
            return window.Ionic.User;
        }]).run([function() {
            window.Ionic.io();
        }]);
} else {
    angular.module('ionic.service.core', []);
}