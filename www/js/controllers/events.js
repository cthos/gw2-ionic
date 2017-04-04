(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('EventsCtrl', EventsCtrl);

  EventsCtrl.$inject = ['GW2API', '$ionicLoading', '$stateParams', '$scope', '$ionicPopup', '$location', '$anchorScroll'];
  function EventsCtrl(GW2API, $ionicLoading, $stateParams, $scope, $ionicPopup, $location, $anchorScroll) {
    var moment = require('moment');
    var vm = this;
    vm.events = [];
    vm.showEventDetails = showEventDetails;
    vm.reload = reload;

    activate();

    ////////////////

    function activate() {
      loadEvents();
    }

    function loadEvents() {
      var events = GW2API.eventsAPI.getEventsFull();
      var now = moment().unix();
      var nextFound = false;
      var nextEventIndex = 0;

      var laterEvents = [];

      events.forEach(function (event, index) {
        if (event.unixtime < now) {
          laterEvents.push(event);
          return;
        }

        vm.events.push(event);
      });

      vm.events = vm.events.concat(laterEvents);
    }

    /**
     * Reloads all achievements.
     */
    function reload() {
      loadEvents();
      $scope.$broadcast('scroll.refreshComplete');
    }

    function showEventDetails(event) {
      // TODO
    }
  }
})();
