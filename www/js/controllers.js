angular.module('starter.controllers', ['ionic'])
.config(function ($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist(['https://api.guildwars2.com/*']);
})

.controller('AppCtrl', function ($scope, $rootScope, $ionicSideMenuDelegate) {
  $rootScope.toggleSide = function () {
    $ionicSideMenuDelegate.toggleRight();
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

.controller('CharacterViewCtrl', function ($scope, $ionicLoading, $stateParams, GW2API) {
  $ionicLoading.show({
    template : 'Loading...'
  });

  GW2API.api.getCharacters($stateParams.charname).then(function (character) {
    $scope.character = character;
    console.log(character);
    $ionicLoading.hide();
  });
})

.controller('WalletCtrl', function ($scope, $ionicLoading, GW2API) {
  $ionicLoading.show({
    template : 'Loading wallet...'
  });

  GW2API.api.getWallet(true).then(function (w) {
    console.log(w);
    $ionicLoading.hide();
    $scope.wallet = w;
  });
})

.controller('SettingsCtrl', function ($scope, GW2API) {
  $scope.settings = {
    apiKey: GW2API.api.getAPIKey()
  };
  $scope.$watch('settings.apiKey', function (newVal) {
    GW2API.api.setAPIKey(newVal);
  });
});
