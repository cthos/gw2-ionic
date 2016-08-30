(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('AchievementCtrl', AchievementController);

  AchievementController.$inject = ['GW2API', '$ionicLoading'];
  function AchievementController(GW2API, $ionicLoading) {
    var vm = this;
    vm.achievements = [];
    activate();

    ////////////////

    function activate() {
      $ionicLoading.show();

      loadAchievements().then(function () {
        $ionicLoading.hide();
      });
    }

    function loadAchievements()
    {
      return GW2API.api.getAccountAchievements(true).then(function (achs) {
        console.log(achs);

        vm.achievements = achs;
      });
    }
  }
})();