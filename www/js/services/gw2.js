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
    api.setCache(false);

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
