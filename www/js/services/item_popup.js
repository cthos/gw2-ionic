(function () {
  'use strict';

  angular
    .module('app.services')
    .factory('ItemPopup', ItemPopup);

  ItemPopup.$inject = ['$ionicPopup'];
  function ItemPopup($ionicPopup) {
    var ItemPopup = {
      pop: pop
    };

    return ItemPopup;

    ////////////////
    function pop(i, $scope) {
      $scope.currentItem = i;

      var myPopup = $ionicPopup.alert({
        templateUrl: "templates/popups/item-detail.html",
        scope: $scope,
        title: i.name
      });
    }
  }
})();