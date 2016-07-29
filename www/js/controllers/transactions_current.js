(function () {
  'use strict';

  angular
    .module('app.controllers')
    .controller('TransactionsCurrentCtrl', TransactionsCurrentCtrl);

  TransactionsCurrentCtrl.$inject = ['GW2API', 'CurrencyFormatter', '$ionicLoading', '$scope', 'ItemPopup'];
  function TransactionsCurrentCtrl(GW2API, CurrencyFormatter, $ionicLoading, $scope, ItemPopup) {
    var moment = require('moment');
    var vm = this;
    vm.buys = [];
    vm.sells = [];
    vm.itemPopup = itemPopup;

    activate();

    ////////////////

    function activate() {
      GW2API.api.getCommerceTransactions(true, 'buys')
        .then(addItemsToResults)
        .then(function (buys) {
          $scope.$evalAsync(function () {
            vm.buys = buys;
          });
        });

      GW2API.api.getCommerceTransactions(true, 'sells')
        .then(addItemsToResults)
        .then(function (sells) {
          $scope.$evalAsync(function () {
            vm.sells = sells;
          });
        });
    }

    // TODO: Genericmake
    function addItemsToResults(res) {
      var itemIds = [];

      res.forEach(function(result) {
        itemIds.push(result.item_id);
      });

      return GW2API.api.getItems(itemIds).then(function (items) {
        items.forEach(function(item) {
          item.item_id = item.id;
          delete item.id;

          for (var i = 0; i < res.length; i++) {
            if (res[i].item_id == item.item_id) {
              Object.assign(res[i], item);
              res[i].formatted_date = moment(res[i].purchased).format('MMMM Do YYYY, h:mm:ss a');
              res[i].formatted_currency = CurrencyFormatter.formatGold(res[i].price);
            }
          }
        });

        return res;
      });
    }

    function itemPopup(i) {
      ItemPopup.pop(i, $scope);
    }
  }
})();