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
(function() {
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
      
      $ionicLoading.show({
        template : 'Getting Characters...'
      });
      vm.characters = [];

      GW2API.api.getCharacters().then(function (characters) {
        vm.characters = characters;
        $ionicLoading.hide();
      }).catch(function (err) {
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

      GW2API.api.getCharacters($stateParams.charname).then(function (character)
      {
        $scope.$evalAsync(function () {
          vm.character = character;
          loadEquipment();
        });
      }).catch(function (e)
        {
          console.log(e);
        });
    }
    
    function loadEquipment()
    {
      return GW2API.api.getDeeperInfo(GW2API.api.getItems, vm.character.equipment).then(function (equipment) {
        $ionicLoading.hide();
        $scope.$evalAsync(function () {
          vm.character.equipment = equipment;
        });
      });
    }
    
    function eqPopup(eq)
    {
      $scope.eq = eq;
      console.log(eq);
      
      var myPopup = $ionicPopup.alert({
        templateUrl: "templates/popups/equipment-detail.html",
        scope: $scope,
        title: eq.name
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
  }
})();
(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('PVPCtrl', PVPCtrl);

  PVPCtrl.$inject = ['$scope'];
  function PVPCtrl($scope) {
    var vm = this;
    
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
(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('TabCtrl', TabCtrl);

  TabCtrl.$inject = ['$scope', '$rootScope', '$ionicSideMenuDelegate', '$ionicLoading', 'GW2API'];
  function TabCtrl($scope, $rootScope, $ionicSideMenuDelegate, $ionicLoading, GW2API) {
    var vm = this;
    
    activate();

    function activate() { 
      $ionicLoading.show({
        template: "Loading Data..."
      });

      GW2API.reload().then(function (achs) {
        $scope.achievements = achs;
        $ionicLoading.hide();
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
(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('WVWCtrl', WVWCtrl);

  WVWCtrl.$inject = ['$scope'];
  function WVWCtrl($scope) {
    var vm = this;
    
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
  }
})();