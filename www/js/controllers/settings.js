(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('SettingsCtrl', SettingsCtrl);

  SettingsCtrl.$inject = ['$scope', '$ionicPopup', 'GW2API', 'GW2APICache'];
  function SettingsCtrl($scope, $ionicPopup, GW2API, GW2APICache) {
    var vm = this;
    vm.clearCache = clearCache;
    vm.scanBarcode = scanBarcode;

    activate();

    ////////////////

    function activate() { 
      vm.settings = {
        apiKey: GW2API.api.getAPIKey()
      };
      $scope.$watch('vm.settings.apiKey', function (newVal) {
        GW2API.api.setAPIKey(newVal);
      });
    }

    function scanBarcode() {
      if (!cordova) {
        return;
      }

      cordova.plugins.barcodeScanner.scan(barcodeSuccess, barcodeFailure);
    }

    function barcodeSuccess(res) {
      if (res.format == 'QR_CODE' && res.text) {
        console.log("Found API Key " + res.text);
        $scope.$evalAsync(function () {
          vm.settings.apiKey = res.text;
        });
      }
    }

    function barcodeFailure(res) {
      console.log(JSON.stringify(res));
    }

    function clearCache() {
      GW2APICache.clear();

      $ionicPopup.alert({
        template: "Cache has been cleared"
      });
    }
  }
})();