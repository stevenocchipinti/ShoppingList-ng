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
  // Prevent the soft keyboard from disappearing when clicking the "+" button
  // ref: https://stackoverflow.com/questions/7621711/how-to-prevent-blur-running-when-clicking-a-link-in-jquery
  var clickedAddButton = false;
  $('#newItem').blur(function() {
    if (clickedAddButton) {
      $('#newItem').focus();
      clickedAddButton = false;
    }
  });
  $('#addItem').click(function() {
    clickedAddButton = true;
  });

  $scope.items = [];

  $scope.addItem = function() {
    $scope.items.push(
      { title: $scope.newItem, checked: false }
    );
    $scope.newItem = "";
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
