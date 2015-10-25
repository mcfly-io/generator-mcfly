'use strict';

if (window.Ionic) {

  var IonicAngularDeploy = null;

  angular.module('ionic.service.deploy', [])

  .factory('$ionicDeploy', [function() {
    if (!IonicAngularDeploy) {
      IonicAngularDeploy = new Ionic.Deploy();
    }
    return IonicAngularDeploy;
  }]);

} else {
  angular.module('ionic.service.deploy', []);
}
