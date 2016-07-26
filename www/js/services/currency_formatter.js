(function() {
'use strict';

  angular
    .module('app.services')
    .factory('CurrencyFormatter', CurrencyFormatter);

  CurrencyFormatter.$inject = [];
  function CurrencyFormatter() {
    var service = {
      formatGold : formatGold
    };
    
    return service;

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