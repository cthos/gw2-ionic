(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('BankCtrl', BankCtrl);

  BankCtrl.$inject = ['GW2API', '$scope', '$ionicLoading', 'ItemPopup'];
  function BankCtrl(GW2API, $scope, $ionicLoading, ItemPopup) {
    var vm = this;
    vm.itemPopup = itemPopup;
  
    activate();

    ////////////////

    function activate() {
      GW2API.api.getAccountBank(true).then(function (bank) {
        $scope.$evalAsync(function () {
          vm.bank = bank;
        });
      });
    }

    function itemPopup(i) {
      ItemPopup.pop(i, $scope);
    }
  }
})();