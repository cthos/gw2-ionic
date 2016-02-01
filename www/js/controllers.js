angular.module('starter.controllers', ['ionic'])
.config(function ($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist(['https://api.guildwars2.com/*']);
})

.controller('AppCtrl', function ($scope, $rootScope, $ionicSideMenuDelegate) {
  $rootScope.toggleSide = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
})

.controller('TabCtrl', function($scope, $rootScope, $ionicSideMenuDelegate, $ionicLoading, GW2API) {
  $ionicLoading.show({
    template: "Loading Data..."
  });
  GW2API.reload().then(function (achs) {
    $scope.achievements = achs;
    $ionicLoading.hide();
  });
})

.controller('PVECtrl', function($scope, GW2API) {
  $scope.$parent.$watch('achievements', function (newVal) {
    if (!newVal) {
      return;
    }
    $scope.pve = $scope.$parent.achievements.pve;
  });
})

.controller('PVPCtrl', function($scope, GW2API) {
  $scope.$parent.$watch('achievements', function (newVal) {
    if (!newVal) {
      return;
    }
    $scope.pvp = $scope.$parent.achievements.pvp;
  });
})

.controller('WVWCtrl', function($scope, GW2API) {
  $scope.$parent.$watch('achievements', function (newVal) {
    if (!newVal) {
      return;
    }
    $scope.wvw = $scope.$parent.achievements.wvw;
  });
})

.controller('CharCtrl', function($scope, $ionicLoading, GW2API) {
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
})

.controller('CharacterViewCtrl', function ($scope, $ionicLoading, GW2API) {

})

.controller('SettingsCtrl', function ($scope, GW2API) {
  $scope.settings = {
    apiKey: GW2API.api.getAPIKey()
  };
  $scope.$watch('settings.apiKey', function (newVal) {
    GW2API.api.setAPIKey(newVal);
  });
});
