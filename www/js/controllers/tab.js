(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('TabCtrl', TabCtrl);

  TabCtrl.$inject = ['$scope', '$rootScope', '$ionicSideMenuDelegate', '$ionicLoading', 'GW2API'];
  function TabCtrl($scope, $rootScope, $ionicSideMenuDelegate, $ionicLoading, GW2API) {
    var vm = this;
    
    activate();

    function activate() { 
      $ionicLoading.show({
        template: "Loading Data..."
      });

      GW2API.reload().then(function (achs) {
        $scope.achievements = achs;
        $ionicLoading.hide();
      });
    }
  }
})();