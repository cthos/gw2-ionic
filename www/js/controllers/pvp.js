(function () {
  'use strict';

  angular
    .module('app.controllers')
    .controller('PVPCtrl', PVPCtrl);

  PVPCtrl.$inject = ['$scope'];
  function PVPCtrl($scope) {
    var vm = this;
    vm.requestDetails = requestDetails;
    vm.reload = reload;

    activate();

    ////////////////

    function activate() {
      $scope.$parent.$watch('achievements', function (newVal) {
        if (!newVal) {
          return;
        }
        vm.pvp = $scope.$parent.achievements.pvp;
      });
    }

    /**
     * Reloads all achievements.
     */
    function reload() {
      $scope.$emit('reload-achievements');
    }
    
    function requestDetails(ach) {
      $scope.$emit('ach-details-req', ach);
    }
  }
})();