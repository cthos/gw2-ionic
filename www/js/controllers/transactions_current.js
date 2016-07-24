(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('TransactionsCurrentCtrl', TransactionsCurrentCtrl);

  TransactionsCurrentCtrl.$inject = ['GW2API', '$ionicLoading'];
  function TransactionsCurrentCtrl(GW2API) {
    var vm = this;

    activate();

    ////////////////

    function activate() { 
      GW2API.api.getCommerceTransactions(true, 'buys').then(function (buys) {
        console.log(buys);
      });

      GW2API.api.getCommerceTransactions(false, 'sells').then(function (sells) {
        console.log(sells);
      });
    }
  }
})();