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

      $scope.$on('wiki-intent', openWikiLink);
      $scope.$on('open-link', openLink);
    }

    /**
     * Listens for wiki-link events and triggers a window.open.
     */
    function openWikiLink(event, wikiLink)
    {
      window.open('http://wiki.guildwars2.com/wiki/' + escape(wikiLink), '_system');
    }

    function openLink(event, linkLocation) {
      window.open(linkLocation, '_system');
    }
  }
})();
(function () {
  'use strict';

  angular
    .module('app.controllers')
    .controller('BankCtrl', BankCtrl);

  BankCtrl.$inject = ['GW2API', '$scope', '$ionicLoading', 'ItemPopup'];
  function BankCtrl(GW2API, $scope, $ionicLoading, ItemPopup) {
    var vm = this;
    vm.itemPopup = itemPopup;
    vm.reload = reload;

    activate();

    ////////////////

    function activate() {
      $ionicLoading.show();
      loadBank().then(function () {
        $ionicLoading.hide();
      });
    }

    function itemPopup(i) {
      ItemPopup.pop(i, $scope);
    }

    function loadBank() {
      return GW2API.api.getAccountBank(true).then(function (bank) {
        $scope.$evalAsync(function () {
          vm.bank = bank;
        });
      });
    }

    function reload() {
      // TODO: Kinda clunky. Maybe a method to disable next call cache?
      // But that could also make cache calls not chain right.
      GW2API.api.setCache(false);
      loadBank().then(function () {
        GW2API.api.setCache(true);
        $scope.$broadcast('scroll.refreshComplete');
      });
      
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
    vm.reload = reload;

    activate();

    ////////////////

    function activate()
    {
      $ionicLoading.show();

      loadData().then(function () {
        $ionicLoading.hide();
      });
    }

    function loadData() {
      return GW2API.api.getCharacters($stateParams.charname).then(function (character)
      {
        vm.character = character;
      }).then(function ()
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

    function reload() {
      GW2API.api.setCache(false);

      loadData().then(function () {
        GW2API.api.setCache(true);
        $scope.$broadcast('scroll.refreshComplete');
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
    vm.reload = reload;

    activate();

    ////////////////

    function activate() {
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
      vm.characters = [];

      loadCharacterData();
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
      $ionicLoading.show();

      loadCharacters().then(function () {
        $ionicLoading.hide();
      });
    }

    function loadCharacters() {
      return GW2API.api.getCharacters($stateParams.charname).then(function (character) {
        vm.character = character;
      });
    }

    function reload() {
      GW2API.api.setCache(false);

      loadCharacters().then(function () {
        GW2API.api.setCache(true);
        $scope.$broadcast('scroll.refreshComplete');
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
    vm.reload = reload;

    activate();

    ////////////////

    function activate() {
      $ionicLoading.show();

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
    
    function reload() {
      GW2API.api.setCache(false);

      loadEquipment().then(function () {
        GW2API.api.setCache(true);
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
  }
})();
(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('EventsCtrl', EventsCtrl);

  EventsCtrl.$inject = ['GW2API', '$ionicLoading', '$stateParams', '$scope', '$ionicPopup', '$location', '$anchorScroll'];
  function EventsCtrl(GW2API, $ionicLoading, $stateParams, $scope, $ionicPopup, $location, $anchorScroll) {
    var moment = require('moment');
    var vm = this;
    vm.events = {};
    vm.showEventDetails = showEventDetails;

    activate();

    ////////////////

    function activate() {
      $ionicLoading.show();
      loadEvents();
    }

    function loadEvents() {
      var events = GW2API.eventsAPI.getEventsFull();
      var now = moment().unix();
      var nextFound = false;
      var nextEventIndex = 0;

      events.forEach(function (event, index) {
        event.index = index;
        event.localTime = moment.unix(event.unixtime).format('h:mm A');
        if (!nextFound && event.unixtime >= now) {
          nextEventIndex = index;
          nextFound = true;
        }
        vm.events[index] = event;
      });

      $ionicLoading.hide();

      // window.setTimeout(function() {
      //   $ionicLoading.hide();
      //   $location.hash('event-' + nextEventIndex);
      //   $anchorScroll();
      // }, 5000);
    }

    function showEventDetails(event) {
      // TODO
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.controllers')
    .controller('CharacterInventoryCtrl', CharacterInventoryCtrl);

  CharacterInventoryCtrl.$inject = ['GW2API', '$stateParams', '$scope', '$ionicLoading', 'ItemPopup'];
  function CharacterInventoryCtrl(GW2API, $stateParams, $scope, $ionicLoading, ItemPopup) {
    var vm = this;
    vm.itemPopup = itemPopup;
    vm.reload = reload;

    activate();

    ////////////////

    function activate() {
      $ionicLoading.show();

      loadAll().then(function () {
        $ionicLoading.hide();
      });
    }

    function loadAll() {
      return GW2API.api.getCharacters($stateParams.charname).then(function (character) {
        vm.character = character;
        return loadInventory();
      }).catch(function (e) {
        console.log(e);
      });
    }
    
    function loadInventory() {
      return GW2API.api.getDeeperInfo(GW2API.api.getItems, vm.character.bags).then(function () {
        var promises = [];
        for (var i = 0; i < vm.character.bags.length; i++) {
          var p = (function (i) {
            return GW2API.api.getDeeperInfo(GW2API.api.getItems, vm.character.bags[i].inventory);
          })(i);
          
          promises.push(p);
        }
        return Promise.all(promises).then(function () {
          // Force a redraw
          $scope.$evalAsync(function () {});
        });
      })
    }
    
    function itemPopup(i) {
      ItemPopup.pop(i, $scope);
    }

    function reload() {
      GW2API.api.setCache(false);

      loadAll().then(function () {
        GW2API.api.setCache(true);
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
  }
})();
(function () {
  'use strict';

  angular
    .module('app.controllers')
    .controller('MaterialsCtrl', MaterialsCtrl);

  MaterialsCtrl.$inject = ['GW2API', '$ionicLoading', '$scope', 'ItemPopup'];
  function MaterialsCtrl(GW2API, $ionicLoading, $scope, ItemPopup) {
    var vm = this;
    vm.itemPopup = itemPopup;
    vm.materialVisible = materialVisible;
    vm.reload = reload;

    activate();

    ////////////////

    function activate() {
      $ionicLoading.show();

      loadMaterials().then(function () {
        $ionicLoading.hide();
      }).catch(function () {
        $ionicLoading.hide();
      });
    }

    function loadMaterials() {
      return GW2API.api.getAccountMaterials(true).then(function (materials) {

        $scope.$evalAsync(function () {
          vm.materials = materials;
        });
      });
    }

    function itemPopup(i) {
      ItemPopup.pop(i, $scope);
    }

    function materialVisible(material) {
      if (!vm.search) {
        return true;
      }

      var matchRexp = new RegExp('.*' + vm.search + '.*', 'i');

      return matchRexp.test(material.name);
    }

    function reload() {
      GW2API.api.setCache(false);

      loadMaterials().then(function () {
        GW2API.api.setCache(true);
        $scope.$broadcast('scroll.refreshComplete');
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
(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('SettingsCtrl', SettingsCtrl);

  SettingsCtrl.$inject = ['$scope', '$ionicPopup', 'GW2API', 'GW2APICache'];
  function SettingsCtrl($scope, $ionicPopup, GW2API, GW2APICache) {
    var vm = this;
    vm.clearCache = clearCache;
    

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

    function clearCache() {
      GW2APICache.clear();

      $ionicPopup.alert({
        template: "Cache has been cleared"
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
      $ionicLoading.show();
      
      $scope.$on('ach-details-req', vm.showRequirementsPopup);

      GW2API.reload().then(function (achs) {
        $scope.achievements = achs;
        $ionicLoading.hide();
      });
    }

    function openWikiLink(wikiLink) {
      //$scope.$emit('');
      //window.open('http://wiki.guildwars2.com/wiki/' + escape(wikiLink), '_system');
    }

    function showRequirementsPopup(ev, ach) {
      $scope.ach = ach;

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
    .controller('TransactionsCtrl', TransactionsCtrl);

  TransactionsCtrl.$inject = [];
  function TransactionsCtrl() {
    var vm = this;
    

    activate();

    ////////////////

    function activate() { }
  }
})();
(function () {
  'use strict';

  angular
    .module('app.controllers')
    .controller('TransactionsCurrentCtrl', TransactionsCurrentCtrl);

  TransactionsCurrentCtrl.$inject = ['GW2API', 'CurrencyFormatter', '$ionicLoading', '$scope', 'ItemPopup'];
  function TransactionsCurrentCtrl(GW2API, CurrencyFormatter, $ionicLoading, $scope, ItemPopup) {
    var moment = require('moment');
    var vm = this;
    vm.buys = [];
    vm.sells = [];
    vm.show = {
      buys : true,
      sells : true
    };
    vm.itemPopup = itemPopup;
    vm.reload = reload;

    vm.toggleSection = toggleSection;

    activate();

    ////////////////

    function activate() {
      $ionicLoading.show();

      loadTransactions().then(function () {
        $ionicLoading.hide();
      });
    }

    function loadTransactions() {
      var loadBuy = GW2API.api.getCommerceTransactions(true, 'buys')
        .then(addItemsToResults)
        .then(function (buys) {
          $scope.$evalAsync(function () {
            vm.buys = buys;
          });
        });

      var loadSell = GW2API.api.getCommerceTransactions(true, 'sells')
        .then(addItemsToResults)
        .then(function (sells) {
          $scope.$evalAsync(function () {
            vm.sells = sells;
          });
        });

      return Promise.all([loadBuy, loadSell]);
    }

    // TODO: Genericmake
    function addItemsToResults(res) {
      var itemIds = [];

      res.forEach(function (result) {
        itemIds.push(result.item_id);
      });

      if (!itemIds.length) {
        return [];
      }

      return GW2API.api.getItems(itemIds).then(function (items) {
        items.forEach(function (item) {
          item.item_id = item.id;
          delete item.id;

          for (var i = 0; i < res.length; i++) {
            if (res[i].item_id == item.item_id) {
              Object.assign(res[i], item);
              res[i].formatted_date = moment(res[i].purchased).format('MMMM Do YYYY, h:mm:ss a');
              res[i].formatted_currency = CurrencyFormatter.formatGold(res[i].price);
            }
          }
        });

        return res;
      });
    }

    function reload() {
      GW2API.api.setCache(false);

      loadTransactions().then(function () {
        GW2API.api.setCache(true);
        $scope.$broadcast('scroll.refreshComplete');
      });
    }

    function toggleSection(section) {
      vm.show[section] = !vm.show[section];
    }

    function itemPopup(i) {
      ItemPopup.pop(i, $scope);
    }
  }
})();
(function () {
  'use strict';

  angular
    .module('app.controllers')
    .controller('TransactionsHistoryCtrl', TransactionsHistoryCtrl);

  TransactionsHistoryCtrl.$inject = ['GW2API', 'CurrencyFormatter', '$ionicLoading', '$scope', 'ItemPopup'];
  function TransactionsHistoryCtrl(GW2API, CurrencyFormatter, $ionicLoading, $scope, ItemPopup) {
    var moment = require('moment');
    var vm = this;
    vm.buys = [];
    vm.sells = [];
    vm.itemPopup = itemPopup;
    vm.reload = reload;

    vm.show = {
      buys : true,
      sells : true
    };
    
    vm.toggleSection = toggleSection;

    activate();

    ////////////////

    function activate() {
      $ionicLoading.show();

      loadTransactions().then(function () {
        $ionicLoading.hide();
      });
    }

    function loadTransactions() { 
      var loadBuy = GW2API.api.getCommerceTransactions(false, 'buys')
        .then(addItemsToResults)
        .then(function (buys) {
          $scope.$evalAsync(function () {
            vm.buys = buys;
          });
        }).catch(function (e) { console.log(e) });

      var loadSell = GW2API.api.getCommerceTransactions(false, 'sells').then(addItemsToResults)
        .then(function (sells) {
          $scope.$evalAsync(function () {
            vm.sells = sells;
          });
        });

      return Promise.all([loadBuy, loadSell])
    }

    function addItemsToResults(res) {
      var itemIds = [];

      res.forEach(function (result) {
        itemIds.push(result.item_id);
      });

      if (!itemIds.length) {
        return [];
      }

      return GW2API.api.getItems(itemIds).then(function (items) {
        items.forEach(function (item) {
          item.item_id = item.id;
          delete item.id;

          for (var i = 0; i < res.length; i++) {
            if (res[i].item_id == item.item_id) {
              Object.assign(res[i], item);
              res[i].formatted_date = moment(res[i].purchased).format('MMMM Do YYYY, h:mm:ss a');
              res[i].formatted_currency = CurrencyFormatter.formatGold(res[i].price);
            }
          }
        });

        return res;
      });
    }

    function reload() {
      GW2API.api.setCache(false);

      loadTransactions().then(function () {
        GW2API.api.setCache(true);
        $scope.$broadcast('scroll.refreshComplete');
      });
    }

    function toggleSection(section) {
      vm.show[section] = !vm.show[section];
    }
    
    function itemPopup(i) {
      ItemPopup.pop(i, $scope);
    }
  }
})();
(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('WalletCtrl', WalletCtrl);

  WalletCtrl.$inject = ['CurrencyFormatter', '$scope', '$ionicLoading', 'GW2API'];
  function WalletCtrl(CurrencyFormatter, $scope, $ionicLoading, GW2API) {
    var vm = this;
    vm.wallet = null;
    vm.formatter = CurrencyFormatter;
    vm.reload = reload;

    activate();

    ////////////////

    function activate() {
       if (!GW2API.api.getAPIKey()) {
        vm.error = "Please set your API key in Settings";
        return;
      }

      $ionicLoading.show();

      loadWallet();
     }

     function loadWallet() {
       return GW2API.api.getWallet(true).then(function (w) {
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

     function reload() {
       GW2API.api.setCache(false);

       loadWallet().then(function () {
         GW2API.api.setCache(true);
        $scope.$broadcast('scroll.refreshComplete');
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