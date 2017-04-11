(function () {
  'use strict';

  angular
    .module('app.controllers')
    .controller('CharacterInventoryCtrl', CharacterInventoryCtrl);

  CharacterInventoryCtrl.$inject = ['GW2API', '$stateParams', '$scope', '$ionicLoading', 'ItemPopup'];
  function CharacterInventoryCtrl(GW2API, $stateParams, $scope, $ionicLoading, ItemPopup) {
    var vm = this;
    vm.itemPopup = itemPopup;
    vm.reload = reload;

    activate();

    ////////////////

    function activate() {
      $ionicLoading.show();

       GW2API.tokenHasPermission('inventories').then(function (hasPerm) {
        if (hasPerm) {
          $ionicLoading.show();

          return loadAll().then(function () {
            $ionicLoading.hide();
          });
        }
        
        vm.error = "Your API token needs the 'inventories' permission to access this page.";
      });
    }

    function loadAll() {
      return GW2API.api.getCharacters($stateParams.charname).then(function (character) {
        vm.character = character;
        return loadInventory();
      }).catch(function (e) {
        console.log(e);
      });
    }
    
    function loadInventory() {
      return GW2API.api.getDeeperInfo(GW2API.api.getItems, vm.character.bags).then(function () {
        var promises = [];
        for (var i = 0; i < vm.character.bags.length; i++) {
          var p = (function (i) {
            return GW2API.api.getDeeperInfo(GW2API.api.getItems, vm.character.bags[i].inventory);
          })(i);
          
          promises.push(p);
        }
        return Promise.all(promises).then(function () {
          // Force a redraw
          $scope.$evalAsync(function () {});
        });
      })
    }
    
    function itemPopup(i) {
      ItemPopup.pop(i, $scope);
    }

    function reload() {
      GW2API.api.setCache(false);
      GW2API.api.setStoreInCache(true);

      loadAll().then(function () {
        GW2API.api.setCache(true);
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
  }
})();