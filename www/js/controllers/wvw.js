(function () {
  'use strict';

  angular
    .module('app.controllers')
    .controller('WVWCtrl', WVWCtrl);

  WVWCtrl.$inject = ['$scope'];
  function WVWCtrl($scope) {
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
        vm.wvw = $scope.$parent.achievements.wvw;
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