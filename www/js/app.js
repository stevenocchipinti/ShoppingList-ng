angular.module('shoppinglist', ['ionic'])

.controller('ShoppingListCtrl', function($scope, $window) {
  // Get the items from localstorage and save them back when they change
  $scope.items = JSON.parse($window.localStorage['items'] || '[]');
  $scope.$watch('items', function(updatedItems) {
    $window.localStorage['items'] = JSON.stringify(updatedItems);
  }, true);

  // Add a new item to the list
  $scope.addItem = function() {
    var newItemName = $scope.newItem.capitalize();
    if (!newItemName.isEmpty() && !$scope.exists(newItemName)) {
      $scope.items.push(
        { title: newItemName, checked: false }
      );
    }
    $scope.newItem = "";
  };

  // Check if item exists
  $scope.exists = function(title) {
    return $scope.items.map(function(x) { return x.title }).indexOf(title) >= 0;
  };

  // Clear all those ticked off items
  $scope.clearDone = function() {
    $scope.items = $scope.items.filter(function(item) {
      return !item.checked
    });
  };

  // Make those fancy delete buttons
  $scope.onItemDelete = function(item) {
    $scope.items.splice($scope.items.indexOf(item), 1);
  };
  $scope.data = {
    showDelete: false
  };

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
})


String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};
