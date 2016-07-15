(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('CharacterRecipiesCtrl', CharacterRecipiesCtrl);

  CharacterRecipiesCtrl.$inject = ['GW2API', '$ionicLoading', '$stateParams', '$scope', '$ionicPopup'];
  function CharacterRecipiesCtrl(GW2API, $ionicLoading, $stateParams, $scope, $ionicPopup) {
    var vm = this;
    vm.outputItems = {};
    vm.inputItems = {};

    vm.showRecipeDetails = showRecipeDetails;

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

    function loadIngredients(ingredients) {
      return GW2API.api.getItems(ingredients);
    }

    function showRecipeDetails(recipe) {
      $ionicLoading.show();
      var loadgredients = [];
      recipe.ingredients.forEach(function (i) {
        loadgredients.push(i.item_id);
      });

      loadIngredients(loadgredients).then(function (ings) {
        var ingredients = {};

        ings.forEach(function (i) {
          ingredients[i.id] = i;
        });

        $scope.recipe = recipe;
        $scope.ingredients = ingredients;

        var myPopup = $ionicPopup.alert({
          templateUrl: "templates/popups/recipe-detail.html",
          scope: $scope,
          title: vm.outputItems[recipe.output_item_id].name
        });

        $ionicLoading.hide();
      }).catch(function (e) {
        console.log(e);
      });
    }
  }
})();