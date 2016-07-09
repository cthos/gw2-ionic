(function () {
  'use strict';

  angular
    .module('app.controllers')
    .controller('TabCtrl', TabCtrl);

  TabCtrl.$inject = ['$scope', '$rootScope', '$ionicSideMenuDelegate', '$ionicLoading', '$ionicPopup','GW2API'];
  function TabCtrl($scope, $rootScope, $ionicSideMenuDelegate, $ionicLoading, $ionicPopup, GW2API) {
    var vm = this;
    vm.showRequirementsPopup = showRequirementsPopup;

    activate();

    function activate() {
      $ionicLoading.show({
        template: "Loading Data..."
      });
      
      $scope.$on('ach-details-req', vm.showRequirementsPopup);

      GW2API.reload().then(function (achs) {
        $scope.achievements = achs;
        $ionicLoading.hide();
      });
    }

    function showRequirementsPopup(ev, ach) {
       $scope.ach = ach;
      
       var myPopup = $ionicPopup.alert({
        templateUrl: "templates/popups/achievement-detail.html",
        scope: $scope,
        title: ach.name
      });
    }
  }
})();