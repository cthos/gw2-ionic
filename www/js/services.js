angular.module('starter.services', [])

.factory('GW2API', function () {
  var Achievements = {
    'pve' : [],
    'pvp' : [],
    'wvw' : []
  };
  var gw2 = require('gw2-api');
  var api = new gw2.gw2();
  //api.setStorage(new gw2.memStore())
  //api.setCache(false);
  api.setUseAuthHeader(false);

  return {
    achivements : Achievements,

    // For those times you want to interact directly with the API.
    api : api,

    reload : function () {
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
          'pve' : [],
          'pvp' : [],
          'wvw' : []
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

    tokenHasPermission : function (permission) {
      if (!this.tokenPerms) {
        var that = this;
        return api.getTokenInfo().then(function (info) {
          that.tokenPerms = info.permissions;
        });
      }
    }
  };
})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Catman',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('User', function () {
  return {
    id : 1,
  }
})

.factory('PersistenceFW', function ($http, User) {
  var BaseUrl = 'http://gw2-api-server.dev'
  var currentId = window.localStorage['pfw-syncId'] || null;

  return {
    currentSyncId : currentId,
    getSyncStatus : function () {
      return $http.get(BaseUrl + '/sync/' + User.id).then(function (resp) {
        return resp.data.syncId;
      });
    },
    syncUp : function (events) {
      return $http.post(BaseUrl + '/sync', {
        user_id : User.id,
        events : events
      }).then(function (resp) {
        return resp.data.sync_id;
      });
    },
    syncDown : function () {
      return $http.get(BaseUrl + '/events/1').then(function (resp) {
        return resp.data;
      });
    }
  };
});
