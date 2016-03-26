(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('CharCtrl', CharCtrl);

  CharCtrl.$inject = ['$scope', '$ionicLoading', 'GW2API'];
  function CharCtrl($scope, $ionicLoading, GW2API) {
    var vm = this;
    
    activate();

    ////////////////

    function activate() {
      $ionicLoading.show({
        template : 'Getting Characters...'
      });
      vm.characters = [];

      GW2API.api.getCharacters().then(function (characters) {
        vm.characters = characters;
        $ionicLoading.hide();
      }).catch(function (err) {
        $ionicLoading.hide();
      });
     }
  }
})();