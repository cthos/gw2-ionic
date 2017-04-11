(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('CharacterEquipmentCtrl', CharacterEquipmentCtrl);

  CharacterEquipmentCtrl.$inject = ['GW2API', '$stateParams', '$scope', '$ionicLoading', '$ionicPopup'];
  function CharacterEquipmentCtrl(GW2API, $stateParams, $scope, $ionicLoading, $ionicPopup) {
    var vm = this;
    vm.eqPopup = eqPopup;
    vm.reload = reload;

    activate();

    ////////////////

    function activate() {
      $ionicLoading.show();

      GW2API.tokenHasPermission('builds').then(function (hasPerm) {
        if (hasPerm) {
          $ionicLoading.show();

          return GW2API.api.getCharacters($stateParams.charname).then(function (character) {
            $scope.$evalAsync(function () {
              vm.character = character;
              loadEquipment();
            });
          }).catch(function (e) {
              console.log(e);
          });
        }
        
        vm.error = "Your API token needs the 'builds' permission to access this page.";
      });

      
    }
    
    function loadEquipment()
    {
      return GW2API.api.getDeeperInfo(GW2API.api.getItems, vm.character.equipment).then(function (equipment) {
        $ionicLoading.hide();
        $scope.$evalAsync(function () {});
      });
    }
    
    function eqPopup($event)
    {
      var eqIndex = $event.target.parentNode.getAttribute('data-eq-index');
      var eq = vm.character.equipment[eqIndex];

      $scope.eq = eq;
      
      var myPopup = $ionicPopup.alert({
        templateUrl: "templates/popups/equipment-detail.html",
        scope: $scope,
        title: eq.name
      });
    }
    
    function reload() {
      GW2API.api.setCache(false);
      GW2API.api.setStoreInCache(true);

      loadEquipment().then(function () {
        GW2API.api.setCache(true);
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
  }
})();