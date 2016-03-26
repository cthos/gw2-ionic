(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('WVWCtrl', WVWCtrl);

  WVWCtrl.$inject = ['$scope'];
  function WVWCtrl($scope) {
    var vm = this;
    
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
  }
})();