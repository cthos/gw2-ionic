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
    var cacheDuration = 4 * 3600 * 1000; // 4 hours

    return service;

    ////////////////
    function setItem(key, value) {
      var trackedKeys = getTrackedKeys();
      var cacheContainer = {
        value : value,
        cachedOn: moment.now(),
        expiresOn: moment.now() + cacheDuration
      };

      if (trackedKeys.indexOf(key) == -1 && key != 'apiKey') {
        trackedKeys.push(key);
      }

      window.localStorage.setItem(TrackedKeyName, JSON.stringify(trackedKeys));

      return window.localStorage.setItem(key, JSON.stringify(cacheContainer));
    }

    function getItem(key) {
      // Backwards compat - if there's no cachedOn, return nothing.
      var value = JSON.parse(window.localStorage.getItem(key));

      if (!value || !value.cachedOn || value.expiresOn < moment.now()) {
        return null;
      }

      return value.value;
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