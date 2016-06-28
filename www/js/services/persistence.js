(function () {
    'use strict';

    angular
    .module('app.services')
    .factory('PersistenceFW', function ($http, User) {
        var BaseUrl = 'http://gw2-api-server.dev'
        var currentId = window.localStorage['pfw-syncId'] || null;

        return {
            currentSyncId: currentId,
            getSyncStatus: function () {
                return $http.get(BaseUrl + '/sync/' + User.id).then(function (resp) {
                    return resp.data.syncId;
                });
            },
            syncUp: function (events) {
                return $http.post(BaseUrl + '/sync', {
                    user_id: User.id,
                    events: events
                }).then(function (resp) {
                    return resp.data.sync_id;
                });
            },
            syncDown: function () {
                return $http.get(BaseUrl + '/events/1').then(function (resp) {
                    return resp.data;
                });
            }
        };
    });
})();