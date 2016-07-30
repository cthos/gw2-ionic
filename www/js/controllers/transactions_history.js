(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('TransactionsHistoryCtrl', TransactionsHistoryCtrl);

  TransactionsHistoryCtrl.$inject = ['GW2API', 'CurrencyFormatter', '$ionicLoading', '$scope', 'ItemPopup'];
  function TransactionsHistoryCtrl(GW2API, CurrencyFormatter, $ionicLoading, $scope, ItemPopup) {
    var moment = require('moment');
    var vm = this;
    vm.buys = [];
    vm.sells = [];
    vm.itemPopup = itemPopup;
    

    activate();

    ////////////////

    function activate() {
      $ionicLoading.show();

      var loadBuy = GW2API.api.getCommerceTransactions(false, 'buys')
        .then(addItemsToResults)
        .then(function (buys) {
          $scope.$evalAsync(function () {
            vm.buys = buys;
          });
        }).catch(function (e) {console.log(e)});

      var loadSell = GW2API.api.getCommerceTransactions(false, 'sells').then(addItemsToResults)
        .then(function (sells) {
          $scope.$evalAsync(function () {
            vm.sells = sells;
          });
        });

        Promise.all([loadBuy, loadSell]).then(function () {
          $ionicLoading.hide();
        });
    }

    function addItemsToResults(res) {
      var itemIds = [];

      res.forEach(function(result) {
        itemIds.push(result.item_id);
      });

      if (!itemIds.length) {
        return [];
      }

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