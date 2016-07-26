(function() {
'use strict';

  angular
    .module('app.services')
    .factory('CurrencyFormatter', CurrencyFormatter);

  CurrencyFormatter.$inject = [];
  function CurrencyFormatter() {
    var service = {
      formatGold : formatGold,
      formatCurrency : formatCurrency
    };
    
    return service;

    function formatCurrency(name, amount) {
      if (name == 'Coin') {
        var cn = formatGold(amount);
        return cn.gold + 'g ' + cn.silver + 's ' + cn.copper + 'c';
      }
      return amount;
    }

    function formatGold(amount) {
      var gold = Math.floor(amount / 10000);
      var silver = Math.floor((amount % 10000) / 100);
      var copper = Math.floor((amount % 10000) % 100);
      return {
        gold: gold,
        silver: silver,
        copper: copper
      }
    }
  }
})();