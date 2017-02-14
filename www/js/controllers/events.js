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

    activate();

    ////////////////

    function activate() {
      $ionicLoading.show();
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
      $ionicLoading.hide();
    }

    function showEventDetails(event) {
      // TODO
    }
  }
})();
