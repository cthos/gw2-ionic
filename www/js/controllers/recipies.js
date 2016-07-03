(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('CharacterRecipiesCtrl', CharacterRecipiesCtrl);

  CharacterRecipiesCtrl.$inject = ['GW2API', '$ionicLoading'];
  function CharacterRecipiesCtrl(GW2API, $ionicLoading) {
    var vm = this;
    

    activate();

    ////////////////

    function activate() { }
  }
})();