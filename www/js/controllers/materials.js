(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('MaterialsCtrl', MaterialsCtrl);

  MaterialsCtrl.$inject = ['GW2API', '$ionicLoading', '$scope', '$ionicPopup'];
  function MaterialsCtrl(GW2API, $ionicLoadig,$scope, $ionicPopup) {
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

    // TODO Make this into a service or a directive or something
    function itemPopup(i) {
      $scope.currentItem = i;
      
       var myPopup = $ionicPopup.alert({
        templateUrl: "templates/popups/item-detail.html",
        scope: $scope,
        title: i.name
      });
    }
  }
})();