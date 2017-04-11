(function () {
  'use strict';

  angular
    .module('app.controllers')
    .controller('CharacterViewCtrl', CharacterViewCtrl);

  CharacterViewCtrl.$inject = ['$scope', '$ionicLoading', '$stateParams', 'GW2API'];
  function CharacterViewCtrl($scope, $ionicLoading, $stateParams, GW2API) {
    var vm = this;

    vm.reload = reload;

    activate();

    ////////////////

    function activate() {

      GW2API.tokenHasPermission('characters').then(function (hasPerm) {
        if (hasPerm) {
          $ionicLoading.show();

          loadCharacters().then(function () {
            $ionicLoading.hide();
          });
        }
        
        vm.error = "Your API token needs the 'builds' permission to access this page.";
      });
    }

    function loadCharacters() {
      return GW2API.api.getCharacters($stateParams.charname).then(function (character) {
        vm.character = character;
      });
    }

    function reload() {
      GW2API.api.setCache(false);
      GW2API.api.setStoreInCache(true);

      loadCharacters().then(function () {
        GW2API.api.setCache(true);
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
  }
})();