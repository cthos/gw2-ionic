(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('CharacterRecipiesCtrl', CharacterRecipiesCtrl);

  CharacterRecipiesCtrl.$inject = ['GW2API', '$ionicLoading', '$stateParams', '$scope'];
  function CharacterRecipiesCtrl(GW2API, $ionicLoading, $stateParams, $scope) {
    var vm = this;
    

    activate();

    ////////////////

    function activate() { 
      $ionicLoading.show({
        template: 'Loading...'
      });

      GW2API.api.getCharacters($stateParams.charname).then(function (character) {
        $scope.$evalAsync(function () {
          vm.character = character;
          console.log(vm.character);
          loadRecipes();
        });
      }).catch(function (e) {
          console.log(e);
      });
    }
    
    function loadRecipes() {
      GW2API.api.getRecipes(vm.character.recipes).then(function (r) {
        // TODO have to replace each recipie's output item with getItems() to get the name.
      });
    }
  }
})();