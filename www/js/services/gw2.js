(function () {
  'use strict';

  angular
    .module('app.services')
    .factory('GW2API', function () {
      var Achievements = {
        'pve': [],
        'pvp': [],
        'wvw': []
      };
      var gw2 = require('gw2-api');
      var api = new gw2.gw2();
      //api.setStorage(new gw2.memStore())
      //api.setCache(false);
      api.setUseAuthHeader(false);

      return {
        achivements: Achievements,

        // For those times you want to interact directly with the API.
        api: api,

        reload: function () {
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
        },

        tokenHasPermission: function (permission) {
          if (!this.tokenPerms) {
            var that = this;
            return api.getTokenInfo().then(function (info) {
              that.tokenPerms = info.permissions;
            });
          }
        }
      };
    })
})();