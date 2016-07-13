(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('CharacterRecipiesCtrl', CharacterRecipiesCtrl);

  CharacterRecipiesCtrl.$inject = ['GW2API', '$ionicLoading', '$stateParams', '$scope'];
  function CharacterRecipiesCtrl(GW2API, $ionicLoading, $stateParams, $scope) {
    var vm = this;
    vm.outputItems = {};
    vm.inputItems = {};

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
      var outputItems = [];

      GW2API.api.getDeeperInfo(GW2API.api.getRecipes, vm.character.recipes).then(function (r) {
          r.forEach(function (rec) {
            outputItems.push(rec.output_item_id);
          });

          vm.recipes = r;
          loadOutputItems(outputItems);
      }).catch(function (e) {
        console.log(e);
      });
    }

    function loadOutputItems(outputItems) {
      GW2API.api.getDeeperInfo(GW2API.api.getItems, outputItems).then(function (items) {
        items.forEach(function (i) {
          vm.outputItems[i.id] = i;
        });
        $ionicLoading.hide();
        $scope.$evalAsync(function () {});
      }).catch(function (e) {
        console.log(e);
      });
    }

    function loadInputItems() {

    }
  }
})();