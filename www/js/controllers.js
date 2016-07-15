angular.module('app.controllers', ['ionic']);
(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('AppCtrl', AppCtrl);

  AppCtrl.$inject = ['$scope', '$rootScope', '$ionicSideMenuDelegate'];
  function AppCtrl($scope, $rootScope, $ionicSideMenuDelegate) {
    var vm = this;

    activate();

    function activate() { 
      $rootScope.toggleSide = function () {
        $ionicSideMenuDelegate.toggleRight();
      };
    }
  }
})();
(function ()
{
  'use strict';

  angular
    .module('app.controllers')
    .controller('CharacterBuildCtrl', CharacterBuildCtrl);

  CharacterBuildCtrl.$inject = ['GW2API', '$scope', '$ionicLoading', '$stateParams', '$ionicPopup'];
  function CharacterBuildCtrl(GW2API, $scope, $ionicLoading, $stateParams, $ionicPopup)
  {
    var vm = this;
    vm.showTraitDetails = showTraitDetails;

    activate();

    ////////////////

    function activate()
    {
      $ionicLoading.show({
        template: 'Loading...'
      });

      GW2API.api.getCharacters($stateParams.charname).then(function (character)
      {
        vm.character = character;
        console.log(character.specializations);
        $ionicLoading.hide();
      })
        .then(function ()
        {
          loadSpecializations();
          loadTraits();
        })
        .catch(function (e)
        {
          console.log(e);
        });
    }

    function showTraitDetails(trait)
    {
      var myPopup = $ionicPopup.alert({
        template: trait.description,
        title: trait.name
      });
    }

    function loadSpecializations()
    {
      return GW2API.api.getProfessionSpecializations(vm.character.profession).then(function (specializations)
      {
        $scope.$evalAsync(function ()
        {
          for (var env in vm.character.specializations) {
            for (var i = 0; i < vm.character.specializations[env].length; i++) {
              specializations.forEach(function (spec)
              {
                if (!vm.character.specializations[env][i]) {
                  return;
                }
                if (spec.id != vm.character.specializations[env][i].id) {
                  return;
                }

                Object.assign(vm.character.specializations[env][i], spec);
              });
            }
          }
        });
      }).catch(function (e)
      {
        console.log(e);
      });
    }

    function loadTraits()
    {
      var traitIds = [];
      for (var env in vm.character.specializations) {
        for (var i = 0; i < vm.character.specializations[env].length; i++) {
          if (!vm.character.specializations[env][i]) {
            continue;
          }
          traitIds = traitIds.concat(vm.character.specializations[env][i].traits);
        }
      }

      return GW2API.api.getTraits(traitIds).then(function (traits)
      {
        $scope.$evalAsync(function ()
        {
          for (var env in vm.character.specializations) {
            for (var i = 0; i < vm.character.specializations[env].length; i++) {
              if (!vm.character.specializations[env][i]) {
                continue;
              }
              for (var j = 0; j < vm.character.specializations[env][i].traits.length; j++) {
                traits.forEach(function (trait)
                {
                  if (!vm.character.specializations[env][i].traits[j]) {
                    return;
                  }
                  if (trait.id != vm.character.specializations[env][i].traits[j]) {
                    return;
                  }


                  vm.character.specializations[env][i].traits[j] = trait;
                });
              }
            }
          }
        });
      }).catch(function (e)
      {
        console.log(e);
      });
    }
  }
})();
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
(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('CharacterViewCtrl', CharacterViewCtrl);

  CharacterViewCtrl.$inject = ['$scope', '$ionicLoading', '$stateParams', 'GW2API'];
  function CharacterViewCtrl($scope, $ionicLoading, $stateParams, GW2API) {
    var vm = this;
    
    activate();

    ////////////////

    function activate() { 
      $ionicLoading.show({
        template : 'Loading...'
      });

      GW2API.api.getCharacters($stateParams.charname).then(function (character) {
        vm.character = character;
        $ionicLoading.hide();
      });
    }
  }
})();
(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('CharacterEquipmentCtrl', CharacterEquipmentCtrl);

  CharacterEquipmentCtrl.$inject = ['GW2API', '$stateParams', '$scope', '$ionicLoading', '$ionicPopup'];
  function CharacterEquipmentCtrl(GW2API, $stateParams, $scope, $ionicLoading, $ionicPopup) {
    var vm = this;
    vm.eqPopup = eqPopup;

    activate();

    ////////////////

    function activate() {
      $ionicLoading.show({
        template: 'Loading...'
      });

      GW2API.api.getCharacters($stateParams.charname).then(function (character) {
        $scope.$evalAsync(function () {
          vm.character = character;
          loadEquipment();
        });
      }).catch(function (e) {
          console.log(e);
      });
    }
    
    function loadEquipment()
    {
      return GW2API.api.getDeeperInfo(GW2API.api.getItems, vm.character.equipment).then(function (equipment) {
        $ionicLoading.hide();
        $scope.$evalAsync(function () {});
      });
    }
    
    function eqPopup(eq)
    {
      $scope.eq = eq;
      
      var myPopup = $ionicPopup.alert({
        templateUrl: "templates/popups/equipment-detail.html",
        scope: $scope,
        title: eq.name
      });
    }
  }
})();
(function () {
  'use strict';

  angular
    .module('app.controllers')
    .controller('CharacterInventoryCtrl', CharacterInventoryCtrl);

  CharacterInventoryCtrl.$inject = ['GW2API', '$stateParams', '$scope', '$ionicPopup'];
  function CharacterInventoryCtrl(GW2API, $stateParams, $scope, $ionicPopup) {
    var vm = this;
    vm.itemPopup = itemPopup;

    activate();

    ////////////////

    function activate() {
      GW2API.api.getCharacters($stateParams.charname).then(function (character) {
        $scope.$evalAsync(function () {
          vm.character = character;
          loadInventory();
        });
      }).catch(function (e) {
        console.log(e);
      });
    }
    
    function loadInventory() {
      GW2API.api.getDeeperInfo(GW2API.api.getItems, vm.character.bags).then(function () {
        var promises = [];
        for (var i = 0; i < vm.character.bags.length; i++) {
          var p = (function (i) {
            return GW2API.api.getDeeperInfo(GW2API.api.getItems, vm.character.bags[i].inventory);
          })(i);
          
          promises.push(p);
        }
        Promise.all(promises).then(function () {
          // Force a redraw
          $scope.$evalAsync(function () {
            console.log(vm.character.bags);
          });
        });
      })
    }
    
    function itemPopup(i) {
      $scope.currentItem = i;
      
       var myPopup = $ionicPopup.alert({
        templateUrl: "templates/popups/item-detail.html",
        scope: $scope,
        title: i.name
      });
    }
  }
})();
(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('PVECtrl', PVECtrl);

  PVECtrl.$inject = ['$scope', 'GW2API'];
  function PVECtrl($scope, GW2API) {
    var vm = this;
    vm.requestDetails = requestDetails;
    activate();

    ////////////////

    function activate() { 
      if (window.localStorage['gw2-completed-events']) {
        vm.events = JSON.parse(window.localStorage['gw2-completed-events']).events;
      } else {
        vm.events = {};
      }

      vm.eventChanged = function (ev) {
        var evs = [];
        console.log(vm.events);
        for (var evid in vm.events) {
          if (vm.events[evid]) {
            evs.push({id : evid});
          }
        }

        window.localStorage['gw2-completed-events'] = JSON.stringify({
          // TODO: Make that work.
          date : '',
          events : vm.events
        });
      };
      $scope.$parent.$watch('achievements', function (newVal) {
        if (!newVal) {
          return;
        }
        vm.pve = $scope.$parent.achievements.pve;
      });
    }

    function requestDetails(ach) {
      $scope.$emit('ach-details-req', ach);
    }
  }
})();
(function () {
  'use strict';

  angular
    .module('app.controllers')
    .controller('PVPCtrl', PVPCtrl);

  PVPCtrl.$inject = ['$scope'];
  function PVPCtrl($scope) {
    var vm = this;
    vm.requestDetails = requestDetails;

    activate();

    ////////////////

    function activate() {
      $scope.$parent.$watch('achievements', function (newVal) {
        if (!newVal) {
          return;
        }
        vm.pvp = $scope.$parent.achievements.pvp;
      });
    }

    function requestDetails(ach) {
      $scope.$emit('ach-details-req', ach);
    }
  }
})();
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
(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('SettingsCtrl', SettingsCtrl);

  SettingsCtrl.$inject = ['$scope', 'GW2API'];
  function SettingsCtrl($scope, GW2API) {
    var vm = this;
    

    activate();

    ////////////////

    function activate() { 
      vm.settings = {
        apiKey: GW2API.api.getAPIKey()
      };
      $scope.$watch('vm.settings.apiKey', function (newVal) {
        GW2API.api.setAPIKey(newVal);
      });
    }
  }
})();
(function () {
  'use strict';

  angular
    .module('app.controllers')
    .controller('TabCtrl', TabCtrl);

  TabCtrl.$inject = ['$scope', '$rootScope', '$ionicSideMenuDelegate', '$ionicLoading', '$ionicPopup','GW2API'];
  function TabCtrl($scope, $rootScope, $ionicSideMenuDelegate, $ionicLoading, $ionicPopup, GW2API) {
    var vm = this;
    vm.showRequirementsPopup = showRequirementsPopup;

    activate();

    function activate() {
      $ionicLoading.show({
        template: "Loading Data..."
      });
      
      $scope.$on('ach-details-req', vm.showRequirementsPopup);

      GW2API.reload().then(function (achs) {
        $scope.achievements = achs;
        $ionicLoading.hide();
      });
    }

    function openWikiLink(wikiLink) {
      console.log("llama");
      window.open('http://wiki.guildwars2.com/wiki/' + escape(wikiLink), '_system');
    }

    function showRequirementsPopup(ev, ach) {
       $scope.ach = ach;
       $scope.openWikiLink = openWikiLink;
      
       var myPopup = $ionicPopup.alert({
        templateUrl: "templates/popups/achievement-detail.html",
        scope: $scope,
        title: ach.name
      });
    }
  }
})();
(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('WalletCtrl', WalletCtrl);

  WalletCtrl.$inject = ['$scope', '$ionicLoading', 'GW2API'];
  function WalletCtrl($scope, $ionicLoading, GW2API) {
    var vm = this;
    vm.wallet = null;

    activate();

    ////////////////

    function activate() {
       if (!GW2API.api.getAPIKey()) {
        vm.error = "Please set your API key in Settings";
        return;
      }
      
      $ionicLoading.show({
        template : 'Loading wallet...'
      });

      GW2API.api.getWallet(true).then(function (w) {
        $ionicLoading.hide();
        if (w.text) {
          vm.error = w.text;
          return;
        }
        vm.wallet = w;
      }).catch(function (err) {
        vm.error = err;
      });
     }
  }
})();
(function () {
  'use strict';

  angular
    .module('app.controllers')
    .controller('WVWCtrl', WVWCtrl);

  WVWCtrl.$inject = ['$scope'];
  function WVWCtrl($scope) {
    var vm = this;
    vm.requestDetails = requestDetails;

    activate();

    ////////////////

    function activate() {
      $scope.$parent.$watch('achievements', function (newVal) {
        if (!newVal) {
          return;
        }
        vm.wvw = $scope.$parent.achievements.wvw;
      });
    }

    function requestDetails(ach) {
      $scope.$emit('ach-details-req', ach);
    }
  }
})();