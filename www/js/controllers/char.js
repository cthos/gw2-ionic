(function () {
  'use strict';

  angular
    .module('app.controllers')
    .controller('CharCtrl', CharCtrl);

  CharCtrl.$inject = ['$scope', '$ionicLoading', 'GW2API'];
  function CharCtrl($scope, $ionicLoading, GW2API) {
    var vm = this;
    vm.reload = reload;

    activate();

    ////////////////

    function activate() {
      if (!GW2API.api.getAPIKey()) {
        vm.error = "Please set your API key in Settings";
        return;
      }

      vm.error = null;
      vm.professionsMap = {};
      vm.characters = [];

      GW2API.tokenHasPermission('characters').then(function (hasPerm) {
        if (hasPerm) {
          return loadCharacterData();
        }
        
        vm.error = "Your API token needs the 'characters' permission to access this page.";
      });
    }

    function loadCharacterData() {
      $ionicLoading.show();

      return GW2API.api.callAPI('characters', { page: 0 }, true).then(function (characters) {
        vm.characters = characters;
        return loadProfessions();
      }).catch(function (err) {
        $ionicLoading.hide();
      });
    }

    function loadProfessions() {
      var professions = [];
      vm.characters.forEach(function (c) {
        professions.push(c.profession);
      });
      return GW2API.api.getOneOrMany('professions', professions, false).then(function (professionsMap) {
        professionsMap.forEach(function (prof) {
          vm.professionsMap[prof.id] = prof;
        });

        $ionicLoading.hide();
      });
    }

    function reload() {
      GW2API.api.setCache(false);

      loadCharacterData().then(function () {
        GW2API.api.setCache(true);
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
  }
})();