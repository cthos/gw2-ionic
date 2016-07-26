angular.module('app.services', []);

(function() {
'use strict';

  angular
    .module('app.services')
    .factory('CurrencyFormatter', CurrencyFormatter);

  CurrencyFormatter.$inject = [];
  function CurrencyFormatter() {
    var service = {
      formatGold : formatGold
    };
    
    return service;

    function formatGold(amount) {
      var gold = Math.floor(amount / 10000);
      var silver = Math.floor((amount % 10000) / 100);
      var copper = Math.floor((amount % 10000) % 100);
      return {
        gold: gold,
        silver: silver,
        copper: copper
      }
    }
  }
})();
(function () {
  'use strict';

  angular
    .module('app.services')
    .factory('GW2API', GW2API);

  GW2API.$inject = [];
  function GW2API() {
    var Achievements = {
      'pve': [],
      'pvp': [],
      'wvw': []
    };
    var gw2 = require('gw2-api');
    var api = new gw2.gw2();
    var gw2Events = require('gw2-events');
    var eventsAPI = new gw2Events.gw2Events();
    api.setUseAuthHeader(false);

    var service = {
      achievements: Achievements,
      api: api,
      eventsAPI: eventsAPI,
      reload: reload,
      tokenHasPermission: tokenHasPermission
    };

    return service;

    ////////////////
    function reload() {
      var achIds = {};
      return api.getDailyAchievements().then(function (achs) {
        var lookups = [];
        for (var type in achs) {
          if (typeof Achievements[type] === 'undefined') {
            continue;
          }
          achIds[type] = [];
          achs[type].forEach(function (a) {
            achIds[type].push(a.id);
            lookups.push(a.id);
          });
        }
        return api.getAchievements(lookups);
      }).then(function (achs) {
        Achievements = {
          'pve': [],
          'pvp': [],
          'wvw': []
        };

        achs.forEach(function (a) {
          for (var type in achIds) {
            if (achIds[type].indexOf(a.id) > -1) {

              Achievements[type].push(a);
              continue;
            }
          }
        });
        return Achievements;
      }).catch(function (e) {
        console.error(e);
      });
    }

    function tokenHasPermission() {
      if (!this.tokenPerms) {
        var that = this;
        return api.getTokenInfo().then(function (info) {
          that.tokenPerms = info.permissions;
        });
      }
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.services')
    .factory('ItemPopup', ItemPopup);

  ItemPopup.$inject = ['$ionicPopup'];
  function ItemPopup($ionicPopup) {
    var ItemPopup = {
      pop: pop
    };

    return ItemPopup;

    ////////////////
    function pop(i, $scope) {
      $scope.currentItem = i;

      var myPopup = $ionicPopup.alert({
        templateUrl: "templates/popups/item-detail.html",
        scope: $scope,
        title: i.name
      });
    }
  }
})();
(function () {
  'use strict';

  angular
    .module('app.services')
    .factory('PersistenceFW', PersistenceFW);

  PersistenceFW.$inject = ['$http', 'User'];
  function PersistenceFW($http, User) {
    var BaseUrl = 'http://gw2-api-server.dev'
    var currentId = window.localStorage['pfw-syncId'] || null;


    var service = {
      currentSyncId: currentId,
      getSyncStatus: getSyncStatus,
      syncUp: syncUp,
      syncDown: syncDown
    };

    return service;

    ////////////////
    function getSyncStatus() {
      return $http.get(BaseUrl + '/sync/' + User.id).then(function (resp) {
        return resp.data.syncId;
      });
    }

    function syncUp() {
      return $http.post(BaseUrl + '/sync', {
        user_id: User.id,
        events: events
      }).then(function (resp) {
        return resp.data.sync_id;
      });
    }

    function syncDown() {
      return $http.get(BaseUrl + '/events/1').then(function (resp) {
        return resp.data;
      });
    }
  }
})();