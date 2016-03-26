(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('SettingsCtrl', SettingsCtrl);

  SettingsCtrl.$inject = ['$scope', 'GW2API'];
  function SettingsCtrl($scope, GW2API) {
    var vm = this;
    

    activate();

    ////////////////

    function activate() { 
      $scope.settings = {
        apiKey: GW2API.api.getAPIKey()
      };
      $scope.$watch('settings.apiKey', function (newVal) {
        GW2API.api.setAPIKey(newVal);
      });
    }
  }
})();