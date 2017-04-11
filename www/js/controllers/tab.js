(function () {
  'use strict';

  angular
    .module('app.controllers')
    .controller('TabCtrl', TabCtrl);

  TabCtrl.$inject = ['$scope', '$rootScope', '$ionicSideMenuDelegate', '$ionicLoading', '$ionicPopup','GW2API'];
  function TabCtrl($scope, $rootScope, $ionicSideMenuDelegate, $ionicLoading, $ionicPopup, GW2API) {
    var vm = this;
    vm.showRequirementsPopup = showRequirementsPopup;
    vm.reload = reload;

    activate();

    function activate() {
      $ionicLoading.show();
      
      $scope.$on('ach-details-req', vm.showRequirementsPopup);
      $scope.$on('reload-achievements', vm.reload);

      console.log("Reloading....");

      GW2API.reload().then(function (achs) {
        $scope.achievements = achs;
        $ionicLoading.hide();
      });
    }

    /**
     * Reloads all achievements
     * 
     */
    function reload() {
      GW2API.api.setCache(false);
      GW2API.api.setStoreInCache(true);

      GW2API.reload().then(function (achs) {
        $scope.achievements = achs;

        GW2API.api.setCache(true);
        $scope.$broadcast('scroll.refreshComplete');
      });
    }

    function openWikiLink(wikiLink) {
      //$scope.$emit('');
      //window.open('http://wiki.guildwars2.com/wiki/' + escape(wikiLink), '_system');
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