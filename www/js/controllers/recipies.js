(function () {
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
    vm.reload = reload;

    vm.showRecipe = showRecipe;
    vm.searchRecipe = searchRecipe;

    activate();

    ////////////////

    function activate() {
      $ionicLoading.show();

      GW2API.api.getCharacters($stateParams.charname).then(function (character) {
        vm.character = character;
        loadRecipes().then(function () {
          $ionicLoading.hide();
        });
      }).catch(function (e) {
        console.log(e);
      });
    }

    function loadRecipes() {
      var outputItems = [];

      return GW2API.api.getDeeperInfo(GW2API.api.getRecipes, vm.character.recipes).then(function (r) {
        r.forEach(function (rec) {
          outputItems.push(rec.output_item_id);
        });

        vm.recipes = r;
        vm.visibleRecipes = r;

        if (!vm.recipes.length) {
          vm.error = "Character has no recipes.";
          return [];
        }

        return loadOutputItems(outputItems);
      }).catch(function (e) {
        console.log(e);
      });
    }

    function loadOutputItems(outputItems) {
      return GW2API.api.getDeeperInfo(GW2API.api.getItems, outputItems).then(function (items) {
        items.forEach(function (i) {
          vm.outputItems[i.id] = i;
        });
        $scope.$evalAsync(function () { });
      }).catch(function (e) {
        console.log(e);
      });
    }

    function searchRecipe() {
      if (!vm.search) {
        vm.visibleRecipes = vm.recipes;
        return;
      }

      var matchRexp = new RegExp('.*' + vm.search + '.*', 'i');

      vm.visibleRecipes = vm.recipes.filter(function (item) {
        return matchRexp.test(vm.outputItems[item.output_item_id].name);
      });
    }

    function loadIngredients(ingredients) {
      return GW2API.api.getItems(ingredients);
    }

    function showRecipe(recipe) {
      if (!vm.search) {
        return true;
      }

      var matchRexp = new RegExp('/' + vm.search + '/', 'i');

      console.log(matchRexp);

      return matchRexp.test(vm.outputItems[recipe.output_item_id].name);

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

    function reload() {
      GW2API.api.setCache(false);

      loadRecipes().then(function () {
        GW2API.api.setCache(true);
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
  }
})();