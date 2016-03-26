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
(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('CharCtrl', CharCtrl);

  CharCtrl.$inject = ['$scope', '$ionicLoading'];
  function CharCtrl(dependency1) {
    var vm = this;
    
    activate();

    ////////////////

    function activate() {
      $ionicLoading.show({
        template : 'Getting Characters...'
      });
      $scope.characters = [];

      GW2API.api.getCharacters().then(function (characters) {
        $scope.characters = characters;
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
        $scope.character = character;
        console.log(character);
        $ionicLoading.hide();
      });
    }
  }
})();
(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('PVECtrl', PVECtrl);

  PVECtrl.$inject = ['$scope', 'GW2API', 'PersistenceFW'];
  function PVECtrl($scope, GW2API, PersistenceFW) {
    var vm = this;
    

    activate();

    ////////////////

    function activate() { 
      if (window.localStorage['gw2-completed-events']) {
        //console.debug(JSON.parse(window.localStorage['gw2-completed-events']).events);
        $scope.events = JSON.parse(window.localStorage['gw2-completed-events']).events;
      } else {
        $scope.events = {};
      }

      PersistenceFW.getSyncStatus().then(function (syncId) {
        if (PersistenceFW.currentSyncId < syncId) {
          PersistenceFW.syncDown().then(function (data) {
            console.log(data);
            $scope.events;
          });
        }
      }).catch(function (fail) {

      });

      $scope.eventChanged = function (ev) {
        var evs = [];
        console.log($scope.events);
        for (var evid in $scope.events) {
          if ($scope.events[evid]) {
            evs.push({id : evid});
          }
        }

        window.localStorage['gw2-completed-events'] = JSON.stringify({
          // TODO: Make that work.
          date : '',
          events : $scope.events
        });

        PersistenceFW.syncUp(evs).then(function (res) {
          console.log(res);
        }).catch(function (err) {
          console.log(err);
        });
      };
      $scope.$parent.$watch('achievements', function (newVal) {
        if (!newVal) {
          return;
        }
        $scope.pve = $scope.$parent.achievements.pve;
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
        $scope.pvp = $scope.$parent.achievements.pvp;
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
      $scope.settings = {
        apiKey: GW2API.api.getAPIKey()
      };
      $scope.$watch('settings.apiKey', function (newVal) {
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

  TabCtrl.$inject = ['$scope', '$rootScope', '$ionicSideMenuDelegate', '$ionicLoading', 'GW2API', 'PersistenceFW'];
  function TabCtrl($scope, $rootScope, $ionicSideMenuDelegate, $ionicLoading, GW2API, PersistenceFW) {
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

    activate();

    ////////////////

    function activate() {
      $ionicLoading.show({
        template : 'Loading wallet...'
      });

      GW2API.api.getWallet(true).then(function (w) {
        $ionicLoading.hide();
        $scope.wallet = w;
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
        $scope.wvw = $scope.$parent.achievements.wvw;
      });
     }
  }
})();