(function ()
{
  'use strict';

  angular
    .module('app.controllers')
    .controller('CharacterBuildCtrl', CharacterBuildCtrl);

  CharacterBuildCtrl.$inject = ['GW2API', '$scope', '$ionicLoading', '$stateParams', '$ionicPopup'];
  function CharacterBuildCtrl(GW2API, $scope, $ionicLoading, $stateParams, $ionicPopup)
  {
    var vm = this;
    vm.showTraitDetails = showTraitDetails;

    activate();

    ////////////////

    function activate()
    {
      $ionicLoading.show({
        template: 'Loading...'
      });

      GW2API.api.getCharacters($stateParams.charname).then(function (character)
      {
        vm.character = character;
        console.log(character.specializations);
        $ionicLoading.hide();
      })
        .then(function ()
        {
          loadSpecializations();
          loadTraits();
        })
        .catch(function (e)
        {
          console.log(e);
        });
    }

    function showTraitDetails(trait)
    {
      var myPopup = $ionicPopup.alert({
        template: trait.description,
        title: trait.name
      });
    }

    function loadSpecializations()
    {
      return GW2API.api.getProfessionSpecializations(vm.character.profession).then(function (specializations)
      {
        for (var env in vm.character.specializations) {
          for (var i = 0; i < vm.character.specializations[env].length; i++) {
            specializations.forEach(function (spec)
            {
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
      }).catch(function (e)
      {
        console.log(e);
      });
    }

    function loadTraits()
    {
      var traitIds = [];
      for (var env in vm.character.specializations) {
        for (var i = 0; i < vm.character.specializations[env].length; i++) {
          if (!vm.character.specializations[env][i]) {
            continue;
          }
          traitIds = traitIds.concat(vm.character.specializations[env][i].traits);
        }
      }

      return GW2API.api.getTraits(traitIds).then(function (traits)
      {
        $scope.$evalAsync(function ()
        {
          for (var env in vm.character.specializations) {
            for (var i = 0; i < vm.character.specializations[env].length; i++) {
              if (!vm.character.specializations[env][i]) {
                continue;
              }
              for (var j = 0; j < vm.character.specializations[env][i].traits.length; j++) {
                traits.forEach(function (trait)
                {
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
        });
      }).catch(function (e)
      {
        console.log(e);
      });
    }
  }
})();