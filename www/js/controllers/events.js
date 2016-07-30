(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('EventsCtrl', EventsCtrl);

  EventsCtrl.$inject = ['GW2API', '$ionicLoading', '$stateParams', '$scope', '$ionicPopup', '$location', '$anchorScroll'];
  function EventsCtrl(GW2API, $ionicLoading, $stateParams, $scope, $ionicPopup, $location, $anchorScroll) {
    var moment = require('moment');
    var vm = this;
    vm.events = {};
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

      events.forEach(function (event, index) {
        event.index = index;
        event.localTime = moment.unix(event.unixtime).format('h:mm A');
        if (!nextFound && event.unixtime >= now) {
          nextEventIndex = index;
          nextFound = true;
        }
        vm.events[index] = event;
      });

      $ionicLoading.hide();

      // window.setTimeout(function() {
      //   $ionicLoading.hide();
      //   $location.hash('event-' + nextEventIndex);
      //   $anchorScroll();
      // }, 5000);
    }

    function showEventDetails(event) {
      // TODO
    }
  }
})();
