(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('CharacterBuildCtrl', CharacterBuildCtrl);

  CharacterBuildCtrl.$inject = ['GW2API', '$ionicLoading', '$stateParams'];
  function CharacterBuildCtrl(GW2API, $ionicLoading, $stateParams) {
    var vm = this;
    

    activate();

    ////////////////

    function activate() {
      $ionicLoading.show({
        template : 'Loading...'
      });
      
      GW2API.api.getCharacters($stateParams.charname).then(function (character) {
        vm.character = character;
        $ionicLoading.hide();
      });
    }
  }
})();