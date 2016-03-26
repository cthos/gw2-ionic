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