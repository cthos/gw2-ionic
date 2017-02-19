(function () {
  'use strict';

  angular
    .module('app.controllers')
    .controller('BankCtrl', BankCtrl);

  BankCtrl.$inject = ['GW2API', '$scope', '$ionicLoading', 'ItemPopup'];
  function BankCtrl(GW2API, $scope, $ionicLoading, ItemPopup) {
    var vm = this;
    vm.itemPopup = itemPopup;
    vm.reload = reload;

    activate();

    ////////////////

    function activate() {
      GW2API.tokenHasPermission('inventories').then(function (hasPerm) {
        if (hasPerm) {
          return loadBank().then(function () {
            $ionicLoading.hide();
          });
        }
        
        vm.error = "Your API token needs the 'inventories' permission to access this page.";
      });

      $ionicLoading.show();
      
    }

    function itemPopup($event) {
      var iIndex = $event.target.getAttribute('data-item-index');

      if (typeof iIndex == 'undefined') {
        return;
      }

      var i = vm.bank[iIndex];

      ItemPopup.pop(i, $scope);
    }

    function loadBank() {
      return GW2API.api.getAccountBank(true).then(function (bank) {
        $scope.$evalAsync(function () {
          vm.bank = bank;
        });
      }).catch(function (e) {
        vm.error = "Please set your API token in settings."
      });
    }

    function reload() {
      // TODO: Kinda clunky. Maybe a method to disable next call cache?
      // But that could also make cache calls not chain right.
      GW2API.api.setCache(false);
      loadBank().then(function () {
        GW2API.api.setCache(true);
        $scope.$broadcast('scroll.refreshComplete');
      });
      
    }
  }
})();