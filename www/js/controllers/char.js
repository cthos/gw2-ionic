(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('CharCtrl', CharCtrl);

  CharCtrl.$inject = ['$scope', '$ionicLoading'];
  function CharCtrl(dependency1) {
    var vm = this;
    
    activate();

    ////////////////

    function activate() {
      $ionicLoading.show({
        template : 'Getting Characters...'
      });
      $scope.characters = [];

      GW2API.api.getCharacters().then(function (characters) {
        $scope.characters = characters;
        $ionicLoading.hide();
      }).catch(function (err) {
        $ionicLoading.hide();
      });
     }
  }
})();