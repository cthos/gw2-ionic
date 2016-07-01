(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('CharacterEquipmentCtrl', CharacterEquipmentCtrl);

  CharacterEquipmentCtrl.$inject = ['GW2API', '$stateParams', '$scope', '$ionicLoading'];
  function CharacterEquipmentCtrl(GW2API, $stateParams, $scope, $ionicLoading) {
    var vm = this;

    activate();

    ////////////////

    function activate() {
      $ionicLoading.show({
        template: 'Loading...'
      });

      GW2API.api.getCharacters($stateParams.charname).then(function (character)
      {
        $scope.$evalAsync(function () {
          vm.character = character;
          console.log(character.equipment);
          loadEquipment();
        });
      }).catch(function (e)
        {
          console.log(e);
        });
    }
    
    function loadEquipment()
    {
      return GW2API.api.getDeeperInfo(GW2API.api.getItems, vm.character.equipment).then(function (equipment) {
        $ionicLoading.hide();
        $scope.$evalAsync(function () {
          vm.character.equipment = equipment;
        });
      });
    }
  }
})();