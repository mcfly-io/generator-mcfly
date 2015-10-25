'use strict';

if (false && window.Ionic) {

    var IonicAngularPush = null;

    angular.module('ionic.service.push', [])

        /**
         * IonicPushAction Service
         *
         * A utility service to kick off misc features as part of the Ionic Push service
         */
        .factory('$ionicPushAction', ['$state', function($state) {

            class PushActionService {

                /**
                 * State Navigation
                 *
                 * Attempts to navigate to a new view if a push notification payload contains:
                 *
                 *   - $state {String} The state name (e.g 'tab.chats')
                 *   - $stateParams {Object} Provided state (url) params
                 *
                 * Find more info about state navigation and params:
                 * https://github.com/angular-ui/ui-router/wiki
                 *
                 * @param {object} notification Notification Object
                 * @return {void}
                 */
                notificationNavigation(notification) {
                    var state = false;
                    var stateParams = {};

                    try {
                        state = notification.additionalData.payload.$state;
                    } catch (e) {
                        state = false;
                    }

                    try {
                        stateParams = JSON.parse(notification.additionalData.payload.$stateParams);
                    } catch (e) {
                        stateParams = {};
                    }

                    if (state) {
                        $state.go(state, stateParams);
                    }
                }
            }

            return new PushActionService();
        }])

        .factory('$ionicPush', [function() {
            if (!IonicAngularPush) {
                IonicAngularPush = new Ionic.Push("DEFER_INIT");
            }
            return IonicAngularPush;
        }])

        .run(['$ionicPush', '$ionicPushAction', function($ionicPush, $ionicPushAction) {
            // This is what kicks off the state redirection when a push notificaiton has the relevant details
            $ionicPush._emitter.on('ionic_push:processNotification', function(notification) {
                if (notification && notification.additionalData && notification.additionalData.foreground === false) {
                    $ionicPushAction.notificationNavigation(notification);
                }
            });

        }]);
} else {
    angular.module('ionic.service.push', []);
}
