(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('WalletCtrl', WalletCtrl);

  WalletCtrl.$inject = ['$scope', '$ionicLoading', 'GW2API'];
  function WalletCtrl($scope, $ionicLoading, GW2API) {
    var vm = this;

    activate();

    ////////////////

    function activate() {
      $ionicLoading.show({
        template : 'Loading wallet...'
      });

      GW2API.api.getWallet(true).then(function (w) {
        $ionicLoading.hide();
        vm.wallet = w;
      });
     }
  }
})();