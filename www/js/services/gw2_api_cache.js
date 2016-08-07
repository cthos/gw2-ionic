(function() {
'use strict';

  angular
    .module('app.services')
    .factory('GW2APICache', GW2APICache);

  GW2APICache.$inject = [];
  function GW2APICache() {
    var service = {
      setItem : setItem,
      getItem : getItem,
      clear : clear
    };

    var TrackedKeyName = 'APITrackedKeys';

    return service;

    ////////////////
    function setItem(key, value) {
      var trackedKeys = getTrackedKeys();

      if (trackedKeys.indexOf(key) == -1 && key != 'apiKey') {
        trackedKeys.push(key);
      }

      window.localStorage.setItem(TrackedKeyName, JSON.stringify(trackedKeys));

      return window.localStorage.setItem(key, value);
    }

    function getItem(key) {
      return window.localStorage.getItem(key);
    }

    function clear() {
      var trackedKeys = getTrackedKeys();

      trackedKeys.forEach(function (key) {
        window.localStorage.removeItem(key);
      });

      window.localStorage.removeItem(TrackedKeyName);
    }

    function getTrackedKeys() {
      var keys = window.localStorage.getItem(TrackedKeyName);

      if (!keys) {
        return [];
      }

      return JSON.parse(keys);
    }
  }
})();