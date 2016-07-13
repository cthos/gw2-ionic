(function () {
  'use strict';

  angular
    .module('app.controllers')
    .controller('CharCtrl', CharCtrl);

  CharCtrl.$inject = ['$scope', '$ionicLoading', 'GW2API'];
  function CharCtrl($scope, $ionicLoading, GW2API) {
    var vm = this;

    activate();

    ////////////////

    function activate() {
      console.log(GW2API.api.getAPIKey());
      if (!GW2API.api.getAPIKey()) {
        vm.error = "Please set your API key in Settings";
        return;
      }

      if (!GW2API.tokenHasPermission('characters')) {
        vm.error = "That token does not have 'characters' permission.";
        return;
      }

      vm.error = null;
      vm.professionsMap = {};

      $ionicLoading.show({
        template: 'Getting Characters...'
      });
      vm.characters = [];

      GW2API.api.callAPI('characters', { page: 0 }, true).then(function (characters) {
        vm.characters = characters;
        loadProfessions();
      }).catch(function (err) {
        $ionicLoading.hide();
      });
    }
    
    function loadProfessions() {
      var professions = [];
      vm.characters.forEach(function (c) {
        professions.push(c.profession);
      });
      GW2API.api.getOneOrMany('professions', professions, false).then(function (professionsMap) {
        professionsMap.forEach(function (prof) {
          vm.professionsMap[prof.id] = prof;
        });
        
        $ionicLoading.hide();
      });
    }
  }
})();