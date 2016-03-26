(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('PVPCtrl', PVPCtrl);

  PVPCtrl.$inject = ['$scope'];
  function PVPCtrl($scope) {
    var vm = this;
    
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
  }
})();