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
    vm.show = {
      buys : true,
      sells : true
    };
    vm.itemPopup = itemPopup;
    vm.reload = reload;

    vm.toggleSection = toggleSection;

    activate();

    ////////////////

    function activate() {
      if (!GW2API.api.getAPIKey()) {
        vm.error = "Please set your API key in Settings";
        return;
      }

      GW2API.tokenHasPermission('tradingpost').then(function (hasPerm) {
        if (hasPerm) {
          $ionicLoading.show();

          return loadTransactions().then(function () {
            $ionicLoading.hide();
          });
        }
        
        vm.error = "Your API token needs the 'tradingpost' permission to access this page.";
      });
    }

    function loadTransactions() {
      var loadBuy = GW2API.api.getCommerceTransactions(true, 'buys')
        .then(addItemsToResults)
        .then(function (buys) {
          $scope.$evalAsync(function () {
            vm.buys = buys;
          });
        });

      var loadSell = GW2API.api.getCommerceTransactions(true, 'sells')
        .then(addItemsToResults)
        .then(function (sells) {
          $scope.$evalAsync(function () {
            vm.sells = sells;
          });
        });

      return Promise.all([loadBuy, loadSell]);
    }

    // TODO: Genericmake
    function addItemsToResults(res) {
      var itemIds = [];

      res.forEach(function (result) {
        itemIds.push(result.item_id);
      });

      if (!itemIds.length) {
        return [];
      }

      return GW2API.api.getItems(itemIds).then(function (items) {
        items.forEach(function (item) {
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

    function reload() {
      GW2API.api.setCache(false);
      GW2API.api.setStoreInCache(true);

      loadTransactions().then(function () {
        GW2API.api.setCache(true);
        $scope.$broadcast('scroll.refreshComplete');
      });
    }

    function toggleSection(section) {
      vm.show[section] = !vm.show[section];
    }

    function itemPopup(i) {
      ItemPopup.pop(i, $scope);
    }
  }
})();