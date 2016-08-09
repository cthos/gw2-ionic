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
      loadBank();
    }

    function itemPopup(i) {
      ItemPopup.pop(i, $scope);
    }

    function loadBank() {
      return GW2API.api.getAccountBank(true).then(function (bank) {
        $scope.$evalAsync(function () {
          vm.bank = bank;
        });
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