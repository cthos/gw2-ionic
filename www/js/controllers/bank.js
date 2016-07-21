(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('BankCtrl', BankCtrl);

  BankCtrl.$inject = ['GW2API', '$scope', '$ionicLoading', '$ionicPopup'];
  function BankCtrl(GW2API, $scope, $ionicLoading, $ionicPopup) {
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
      $scope.currentItem = i;
      
       var myPopup = $ionicPopup.alert({
        templateUrl: "templates/popups/item-detail.html",
        scope: $scope,
        title: i.name
      });
    }
  }
})();