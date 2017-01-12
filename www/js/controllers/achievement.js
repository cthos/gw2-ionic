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
    vm.achievements = vm.visibleAchievements = [];
    vm.searchAchievements = searchAchievements;
    vm.reload = reload;

    activate();

    ////////////////

    function activate() {
      $ionicLoading.show();

      loadAchievements().then(function () {
        $ionicLoading.hide();
      });
    }

    function searchAchievements() {
      if (!vm.search) {
        vm.visibleAchievements = vm.achievements;
        return;
      }

      var matchRexp = new RegExp('.*' + vm.search + '.*', 'i');

      vm.visibleAchievements = vm.achievements.filter(function (item) {
        return matchRexp.test(item.name);
      });
    }

    function loadAchievements() {
      return GW2API.api.getAccountAchievements(true).then(function (achs) {
        vm.achievements = vm.visibleAchievements = achs;
      }).catch(function (err) {
        $ionicLoading.hide();
        vm.error = "There was an error. Ensure you have entered your API token.";
      });
    }

    function reload() {
      GW2API.api.setCache(false);
      loadAchievements().then(function (achs) {
        GW2API.api.setCache(true);

        $scope.$broadcast('scroll.refreshComplete');
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