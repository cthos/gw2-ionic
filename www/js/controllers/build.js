(function () {
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
        template: 'Loading...'
      });

      GW2API.api.getCharacters($stateParams.charname).then(function (character) {
        vm.character = character;
        console.log(character.specializations);
        $ionicLoading.hide();
      })
        .then(function () {
          loadSpecializations();
          loadTraits();
        })
        .catch(function (e) {
          console.log(e);
        });
    }

    function loadSpecializations() {
      return GW2API.api.getProfessionSpecializations(vm.character.profession).then(function (specializations) {
        console.log(specializations);
        for (var env in vm.character.specializations) {
          for (var i = 0; i < vm.character.specializations[env].length; i++) {
            specializations.forEach(function (spec) {
              if (!vm.character.specializations[env][i]) {
                return;
              }
              if (spec.id != vm.character.specializations[env][i].id) {
                return;
              }

              Object.assign(vm.character.specializations[env][i], spec);
            });
          }
        }
        console.log("Specs normalized");
        console.log(vm.character.specializations);
      }).catch(function (e) {
        console.log(e);
      });
    }

    function loadTraits() {
      var traitIds = [];
      for (var env in vm.character.specializations) {
        for (var i = 0; i < vm.character.specializations[env].length; i++) {
          traitIds = traitIds.concat(vm.character.specializations[env][i].traits);
        }
      }

      return GW2API.api.getTraits(traitIds).then(function (traits) {
        for (var env in vm.character.specializations) {
          for (var i = 0; i < vm.character.specializations[env].length; i++) {
            for (var j = 0; j < vm.character.specializations[env][i].traits.length; j++) {
              traits.forEach(function (trait) {
                if (!vm.character.specializations[env][i].traits[j]) {
                  return;
                }
                if (trait.id != vm.character.specializations[env][i].traits[j]) {
                  return;
                }
                vm.character.specializations[env][i].traits[j] = trait;
              });
            }
          }
        }
      }).catch(function (e) {
        console.log(e);
      });
    }
  }
})();