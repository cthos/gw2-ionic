// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'app.controllers', 'app.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
      if (window.cordova && window.cordova.InAppBrowser) {
        window.open = window.cordova.InAppBrowser.open;
      }
    }
  });
})
.config(function ($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist(['https://api.guildwars2.com/*']);
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('app', {
    controller : 'AppCtrl',
    templateUrl : 'templates/app.html'
  })

  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'TabCtrl',
    parent : 'app'
  })

  // Each tab has its own nav history stack:

  .state('tab.pve', {
    url: '/pve',
    views: {
      'tab-pve': {
        templateUrl: 'templates/tab-pve.html',
        controller: 'PVECtrl as vm'
      }
    }
  })

  .state('tab.pvp', {
      url: '/pvp',
      views: {
        'tab-pvp': {
          templateUrl: 'templates/tab-pvp.html',
          controller: 'PVPCtrl as vm'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl as vm'
        }
      }
    })

  .state('tab.wvw', {
    url: '/wvw',
    views: {
      'tab-wvw': {
        templateUrl: 'templates/tab-wvw.html',
        controller: 'WVWCtrl as vm'
      }
    }
  })

  .state('characters', {
    url: '/characters',
    templateUrl : 'templates/characters.html',
    controller : 'CharCtrl as vm',
    parent : 'app'
  })

  .state('bank', {
    url: '/bank',
    templateUrl : 'templates/bank.html',
    controller : 'BankCtrl as vm',
    parent : 'app'
  })

  .state('materials', {
    url: '/materials',
    templateUrl : 'templates/materials.html',
    controller : 'MaterialsCtrl as vm',
    parent : 'app'
  })

  .state('transactions', {
    url: '/transactions',
    templateUrl : 'templates/transactions.html',
    controller : 'TransactionsCtrl as vm',
    parent : 'app'
  })

  .state('transactions.current', {
    url: '/transactions',
    templateUrl : 'templates/transactions/current.html',
    controller : 'TransactionsCurrentCtrl as vm',
    parent : 'transactions'
  })

  .state('transactions.history', {
    url: '/transactions',
    templateUrl : 'templates/transactions/history.html',
    controller : 'TransactionsHistoryCtrl as vm',
    parent : 'transactions'
  })

  .state('character-detail', {
    url: '/character/{charname}',
    templateUrl : 'templates/character-detail.html',
    controller : 'CharacterViewCtrl as vm',
    parent : 'app'
  })
  
  .state('character-build', {
    url: '/character/{charname}/build',
    templateUrl : 'templates/character-build.html',
    controller : 'CharacterBuildCtrl as vm',
    parent : 'app'
  })
  
  .state('character-equipment', {
    url: '/character/{charname}/equipment',
    templateUrl : 'templates/character-equipment.html',
    controller : 'CharacterEquipmentCtrl as vm',
    parent : 'app'
  })
  
  .state('character-inventory', {
    url: '/character/{charname}/inventory',
    templateUrl : 'templates/character-inventory.html',
    controller : 'CharacterInventoryCtrl as vm',
    parent : 'app'
  })
  
  .state('character-recipies', {
    url: '/character/{charname}/recipies',
    templateUrl : 'templates/character-recipies.html',
    controller : 'CharacterRecipiesCtrl as vm',
    parent : 'app'
  })

  .state('wallet', {
    url : '/wallet',
    templateUrl : 'templates/wallet.html',
    controller : 'WalletCtrl as vm',
    parent : 'app'
  })

  .state('settings', {
    url: '/settings',
    templateUrl : 'templates/settings.html',
    controller : 'SettingsCtrl as vm',
    parent : 'app'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/pve');

});
