(function () {
  'use strict';

  angular
    .module('app.controllers')
    .controller('MaterialsCtrl', MaterialsCtrl);

  MaterialsCtrl.$inject = ['GW2API', '$ionicLoading', '$scope', '$ionicScrollDelegate', 'ItemPopup'];
  function MaterialsCtrl(GW2API, $ionicLoading, $scope, $ionicScrollDelegate, ItemPopup) {
    var vm = this;
    vm.itemPopup = itemPopup;
    vm.materialVisible = materialVisible;
    vm.showMoreOnBottom = showMoreOnBottom;
    vm.reload = reload;
    vm.visibleMaterials = vm.materials = [];

    vm.currentSpliceEnd = 0;
    vm.spliceSteps = 50;

    activate();

    ////////////////

    function activate() {
      $ionicLoading.show();

      $scope.$watch('vm.search', filterVisibleMaterials);

      $scope.$on('$ionicView.leave', function (ev) {
        vm.currentSpliceEnd = 0;
        respliceMaterials();
      });

      loadMaterials().then(function () {
        $ionicLoading.hide();
      }).catch(function () {
        $ionicLoading.hide();
        vm.error = "Please set your API token in settings."
      });
    }

    function loadMaterials() {
      return GW2API.api.getAccountMaterials(true).then(function (materials) {

        $scope.$evalAsync(function () {
          vm.materials = materials;

          respliceMaterials();
        });
      });
    }

    function filterVisibleMaterials() {
      vm.visibleMaterials = vm.materials.filter(function (material) {
        if (!vm.search) {
          return true;
        }

        var matchRexp = new RegExp('.*' + vm.search + '.*', 'i');
        return matchRexp.test(material.name);
      });
    }

    function itemPopup($event) {
      var iIndex = $event.target.getAttribute('data-item-index');

      if (typeof iIndex == 'undefined') {
        return;
      }

      var i = vm.visibleMaterials[iIndex];

      ItemPopup.pop(i, $scope);
    }

    function materialVisible(material) {
      if (!vm.search) {
        return true;
      }

      var matchRexp = new RegExp('.*' + vm.search + '.*', 'i');

      return matchRexp.test(material.name);
    }

    function respliceMaterials() {
      if (vm.visibleMaterials.length >= vm.materials.length) {
        return;
      }

      vm.currentSpliceEnd += vm.spliceSteps;
      vm.visibleMaterials = vm.materials.slice(0, vm.currentSpliceEnd);

      $scope.$broadcast('scroll.infiniteScrollComplete');
    }

    function showMoreOnBottom() {
      if (vm.search) {
        return;
      }
      
      respliceMaterials();
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