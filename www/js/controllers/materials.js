(function () {
  'use strict';

  angular
    .module('app.controllers')
    .controller('MaterialsCtrl', MaterialsCtrl);

  MaterialsCtrl.$inject = ['GW2API', '$ionicLoading', '$scope', 'ItemPopup'];
  function MaterialsCtrl(GW2API, $ionicLoading, $scope, ItemPopup) {
    var vm = this;
    vm.itemPopup = itemPopup;
    vm.materialVisible = materialVisible;
    vm.reload = reload;

    activate();

    ////////////////

    function activate() {
      $ionicLoading.show();

      loadMaterials().then(function () {
        $ionicLoading.hide();
      }).catch(function () {
        $ionicLoading.hide();
      });
    }

    function loadMaterials() {
      return GW2API.api.getAccountMaterials(true).then(function (materials) {

        $scope.$evalAsync(function () {
          vm.materials = materials;
        });
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

    function reload() {
      GW2API.api.setCache(false);

      loadMaterials().then(function () {
        GW2API.api.setCache(true);
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
  }
})();