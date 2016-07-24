(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('TransactionsHistoryCtrl', TransactionsHistoryCtrl);

  TransactionsHistoryCtrl.$inject = ['GW2API', '$ionicLoading'];
  function TransactionsHistoryCtrl(GW2API, $ionicLoading) {
    var vm = this;
    

    activate();

    ////////////////

    function activate() {
      GW2API.api.getCommerceTransactions(false, 'buys').then(function (buys) {
        console.log(buys);
      });

      GW2API.api.getCommerceTransactions(false, 'sells').then(function (sells) {
        console.log(sells);
      });
    }
  }
})();