(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('EventsCtrl', EventsCtrl);

  EventsCtrl.$inject = ['GW2API', '$ionicLoading', '$stateParams', '$scope', '$ionicPopup'];
  function EventsCtrl(GW2API, $ionicLoading, $stateParams, $scope, $ionicPopup) {
    var vm = this;
    vm.outputItems = {};
    vm.inputItems = {};

    vm.showEventDetails = showEventDetails;

    activate();

    ////////////////

    function activate() {
      $ionicLoading.show({
        template: 'Loading...'
      });

      loadEvents();
    }

    function loadEvents() {
      console.log(GW2API);
      var outputItems = [];
      events = GW2API.eventsAPI.getEventsFull();

      console.log(events);
      loadOutputItems(outputItems);
    }

    function loadOutputItems(outputItems) {
      events.forEach(function (event) {
        console.log(event);
      });

      // TODO
    }

    function showEventDetails(event) {
      // TODO
    }
  }
})();
