angular.module('app.services', []);

(function() {
'use strict';

  angular
    .module('app.services')
    .factory('CurrencyFormatter', CurrencyFormatter);

  CurrencyFormatter.$inject = [];
  function CurrencyFormatter() {
    var service = {
      formatGold : formatGold,
      formatCurrency : formatCurrency
    };
    
    return service;

    function formatCurrency(name, amount) {
      if (name == 'Coin') {
        var cn = formatGold(amount);
        return cn.gold + 'g ' + cn.silver + 's ' + cn.copper + 'c';
      }
      return amount;
    }

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

  GW2API.$inject = ['GW2APICache'];
  function GW2API(GW2APICache) {
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
    api.setStorage(GW2APICache);
    api.setCache(true);

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

    function tokenHasPermission(permission) {
      if (!this.tokenPerms) {
        var that = this;
        return api.getTokenInfo().then(function (info) {
          that.tokenPerms = info.permissions;

          return that.tokenPerms.indexOf(permission) !== -1;
        });
      }

      return Promise.resolve(this.tokenPerms.indexOf(permission) !== -1);
    }
  }
})();

(function() {
'use strict';

  angular
    .module('app.services')
    .factory('GW2APICache', GW2APICache);

  GW2APICache.$inject = [];
  function GW2APICache() {
    var service = {
      setItem : setItem,
      getItem : getItem,
      clear : clear
    };

    var TrackedKeyName = 'APITrackedKeys';

    return service;

    ////////////////
    function setItem(key, value) {
      var trackedKeys = getTrackedKeys();

      if (trackedKeys.indexOf(key) == -1 && key != 'apiKey') {
        trackedKeys.push(key);
      }

      window.localStorage.setItem(TrackedKeyName, JSON.stringify(trackedKeys));

      return window.localStorage.setItem(key, value);
    }

    function getItem(key) {
      return window.localStorage.getItem(key);
    }

    function clear() {
      var trackedKeys = getTrackedKeys();

      trackedKeys.forEach(function (key) {
        window.localStorage.removeItem(key);
      });

      window.localStorage.removeItem(TrackedKeyName);
    }

    function getTrackedKeys() {
      var keys = window.localStorage.getItem(TrackedKeyName);

      if (!keys) {
        return [];
      }

      return JSON.parse(keys);
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