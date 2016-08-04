(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('MaterialsCtrl', MaterialsCtrl);

  MaterialsCtrl.$inject = ['GW2API', '$ionicLoading', '$scope', 'ItemPopup'];
  function MaterialsCtrl(GW2API, $ionicLoading, $scope, ItemPopup) {
    var vm = this;
    vm.itemPopup = itemPopup;
    vm.materialVisible = materialVisible;

    activate();

    ////////////////

    function activate() {
      $ionicLoading.show();

      GW2API.api.getAccountMaterials(true).then(function (materials) {
        $ionicLoading.hide();
        $scope.$evalAsync(function () {
          vm.materials = materials;
        });
      }).catch(function (e) {
        $ionicLoading.hide();
      });
    }
    
    function itemPopup(i) {
      ItemPopup.pop(i, $scope);
    }

    function materialVisible(material) {
      if (!vm.search) {
        return true;
      }

      var matchRexp = new RegExp('.*' + vm.search + '.*', 'i');

      return matchRexp.test(material.name);
    }
  }
})();