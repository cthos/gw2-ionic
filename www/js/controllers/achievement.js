(function () {
  'use strict';

  angular
    .module('app.controllers')
    .controller('AchievementCtrl', AchievementController);

  AchievementController.$inject = ['GW2API', '$ionicLoading', '$scope', '$ionicPopup'];
  function AchievementController(GW2API, $ionicLoading, $scope, $ionicPopup) {
    var vm = this;
    vm.showAchievementDetails = showAchievementDetails;
    vm.calcGradientPercent = calcGradientPercent;
    vm.achievements = [];
    activate();

    ////////////////

    function activate() {
      $ionicLoading.show();

      loadAchievements().then(function () {
        $ionicLoading.hide();
      });
    }

    function loadAchievements() {
      return GW2API.api.getAccountAchievements(true).then(function (achs) {
        console.log(achs);

        vm.achievements = achs;
      });
    }

    function showAchievementDetails(achievement) {
      $scope.ach = achievement;
      
      var myPopup = $ionicPopup.alert({
        templateUrl: "templates/popups/account-achievement-detail.html",
        scope: $scope,
        title: achievement.name
      });
    }

    function calcGradientPercent(achievement) {
      return Math.round(achievement.current / achievement.max * 100);
    }
  }
})();