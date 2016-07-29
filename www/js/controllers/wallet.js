(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('WalletCtrl', WalletCtrl);

  WalletCtrl.$inject = ['CurrencyFormatter', '$scope', '$ionicLoading', 'GW2API'];
  function WalletCtrl(CurrencyFormatter, $scope, $ionicLoading, GW2API) {
    var vm = this;
    vm.wallet = null;
    vm.formatter = CurrencyFormatter;

    activate();

    ////////////////

    function activate() {
       if (!GW2API.api.getAPIKey()) {
        vm.error = "Please set your API key in Settings";
        return;
      }
      
      $ionicLoading.show();

      GW2API.api.getWallet(true).then(function (w) {
        $ionicLoading.hide();
        if (w.text) {
          vm.error = w.text;
          return;
        }
        vm.wallet = w;
      }).catch(function (err) {
        vm.error = err;
      });
     }
  }
})();