(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('CharacterEquipmentCtrl', CharacterEquipmentCtrl);

  CharacterEquipmentCtrl.$inject = ['GW2API', '$stateParams', '$scope', '$ionicLoading', '$ionicPopup'];
  function CharacterEquipmentCtrl(GW2API, $stateParams, $scope, $ionicLoading, $ionicPopup) {
    var vm = this;
    vm.eqPopup = eqPopup;

    activate();

    ////////////////

    function activate() {
      $ionicLoading.show({
        template: 'Loading...'
      });

      GW2API.api.getCharacters($stateParams.charname).then(function (character) {
        $scope.$evalAsync(function () {
          vm.character = character;
          loadEquipment();
        });
      }).catch(function (e) {
          console.log(e);
      });
    }
    
    function loadEquipment()
    {
      return GW2API.api.getDeeperInfo(GW2API.api.getItems, vm.character.equipment).then(function (equipment) {
        $ionicLoading.hide();
        $scope.$evalAsync(function () {});
      });
    }
    
    function eqPopup(eq)
    {
      $scope.eq = eq;
      console.log(eq);
      
      var myPopup = $ionicPopup.alert({
        templateUrl: "templates/popups/equipment-detail.html",
        scope: $scope,
        title: eq.name
      });
    }
  }
})();