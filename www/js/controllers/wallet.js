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
    vm.reload = reload;

    activate();

    ////////////////

    function activate() {
       if (!GW2API.api.getAPIKey()) {
        vm.error = "Please set your API key in Settings";
        return;
      }

      GW2API.tokenHasPermission('wallet').then(function (hasPerm) {
        if (hasPerm) {
          $ionicLoading.show();

          return loadWallet();
        }

        vm.error = "Your API token needs the 'wallet' permission to access this page.";
      });
     }

     function loadWallet() {
       return GW2API.api.getWallet(true).then(function (w) {
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

     function reload() {
       GW2API.api.setCache(false);

       loadWallet().then(function () {
         GW2API.api.setCache(true);
        $scope.$broadcast('scroll.refreshComplete');
       });
     }
  }
})();