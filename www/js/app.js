angular.module('shoppinglist', ['ionic'])

.factory('Item', ['$window', function($window) {
  return {
    get: function() {
      return JSON.parse($window.localStorage['items'] || '[]');
    },
    set: function(value) {
      $window.localStorage['items'] = JSON.stringify(value);
    }
  }
}])

.controller('ShoppingListCtrl', function($scope, Item) {
  $scope.items = [];

  $scope.addItem = function() {
    $scope.items.push(
      { title: $scope.newItem, checked: false }
    );
    $scope.newItem = "";
    $('#newItem').focus();
  };

  $scope.clearDone = function() {
    $scope.items = $scope.items.filter(function(item) {
      return !item.checked
    });
  };


  $scope.onItemDelete = function(item) {
    $scope.items.splice($scope.items.indexOf(item), 1);
  };
  $scope.data = {
    showDelete: false
  };
})
