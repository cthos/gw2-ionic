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