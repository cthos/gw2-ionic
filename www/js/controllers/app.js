(function() {
'use strict';

  angular
    .module('app.controllers')
    .controller('AppCtrl', AppCtrl);

  AppCtrl.$inject = ['$scope', '$rootScope', '$ionicSideMenuDelegate'];
  function AppCtrl($scope, $rootScope, $ionicSideMenuDelegate) {
    var vm = this;

    activate();

    function activate() { 
      $rootScope.toggleSide = function () {
        $ionicSideMenuDelegate.toggleRight();
      };

      $scope.$on('wiki-intent', openWikiLink);
      $scope.$on('open-link', openLink);
    }

    /**
     * Listens for wiki-link events and triggers a window.open.
     */
    function openWikiLink(event, wikiLink)
    {
      window.open('http://wiki.guildwars2.com/wiki/' + escape(wikiLink), '_system');
    }

    function openLink(event, linkLocation) {
      window.open(linkLocation, '_system');
    }
  }
})();