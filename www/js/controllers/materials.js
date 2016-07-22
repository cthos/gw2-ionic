(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('MaterialsCtrl', MaterialsCtrl);

  MaterialsCtrl.$inject = ['GW2API', '$ionicLoading', '$scope', 'ItemPopup'];
  function MaterialsCtrl(GW2API, $ionicLoadig,$scope, ItemPopup) {
    var vm = this;
    vm.itemPopup = itemPopup;

    activate();

    ////////////////

    function activate() {
      GW2API.api.getAccountMaterials(true).then(function (materials) {
        $scope.$evalAsync(function () {
          vm.materials = materials;
        });
      });
    }
    
    function itemPopup(i) {
      ItemPopup.pop(i, $scope);
    }
  }
})();