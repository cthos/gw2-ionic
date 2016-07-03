(function () {
  'use strict';

  angular
    .module('app.controllers')
    .controller('CharacterInventoryCtrl', CharacterInventoryCtrl);

  CharacterInventoryCtrl.$inject = ['GW2API', '$stateParams', '$scope', '$ionicPopup'];
  function CharacterInventoryCtrl(GW2API, $stateParams, $scope, $ionicPopup) {
    var vm = this;
    vm.itemPopup = itemPopup;

    activate();

    ////////////////

    function activate() {
      GW2API.api.getCharacters($stateParams.charname).then(function (character) {
        $scope.$evalAsync(function () {
          vm.character = character;
          loadInventory();
        });
      }).catch(function (e) {
        console.log(e);
      });
    }
    
    function loadInventory() {
      GW2API.api.getDeeperInfo(GW2API.api.getItems, vm.character.bags).then(function () {
        var promises = [];
        for (var i = 0; i < vm.character.bags.length; i++) {
          var p = (function (i) {
            return GW2API.api.getDeeperInfo(GW2API.api.getItems, vm.character.bags[i].inventory);
          })(i);
          
          promises.push(p);
        }
        Promise.all(promises).then(function () {
          // Force a redraw
          $scope.$evalAsync(function () {
            console.log(vm.character.bags);
          });
        });
      })
    }
    
    function itemPopup(i) {
      $scope.currentItem = i;
      
       var myPopup = $ionicPopup.alert({
        templateUrl: "templates/popups/item-detail.html",
        scope: $scope,
        title: i.name
      });
    }
  }
})();