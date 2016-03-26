(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('CharacterViewCtrl', CharacterViewCtrl);

  CharacterViewCtrl.$inject = ['$scope', '$ionicLoading', '$stateParams', 'GW2API'];
  function CharacterViewCtrl($scope, $ionicLoading, $stateParams, GW2API) {
    var vm = this;
    
    activate();

    ////////////////

    function activate() { 
      $ionicLoading.show({
        template : 'Loading...'
      });

      GW2API.api.getCharacters($stateParams.charname).then(function (character) {
        $scope.character = character;
        console.log(character);
        $ionicLoading.hide();
      });
    }
  }
})();