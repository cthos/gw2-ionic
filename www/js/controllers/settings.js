(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('SettingsCtrl', SettingsCtrl);

  SettingsCtrl.$inject = ['$scope', '$ionicPopup', 'GW2API', 'GW2APICache'];
  function SettingsCtrl($scope, $ionicPopup, GW2API, GW2APICache) {
    var vm = this;
    vm.clearCache = clearCache;
    

    activate();

    ////////////////

    function activate() { 
      vm.settings = {
        apiKey: GW2API.api.getAPIKey()
      };
      $scope.$watch('vm.settings.apiKey', function (newVal) {
        GW2API.api.setAPIKey(newVal);
      });
    }

    function clearCache() {
      GW2APICache.clear();

      $ionicPopup.alert({
        template: "Cache has been cleared"
      });
    }
  }
})();