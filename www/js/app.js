angular.module('shoppinglist', ['ionic'])

.factory('ShoppingList', function($window, $rootScope) {
  var shoppingList = {
    items: angular.fromJson($window.localStorage['items'] || '[]'),
    add: function(title) {
      title = title.capitalize();
      if (!title.isEmpty() && !this.exists(title)) {
        this.items.push({
          title: title,
          checked: false
        });
      }
    },
    exists: function(title) {
      return this.items.map(function(x) { return x.title }).indexOf(title) >= 0;
    },
    clearDone: function() {
      this.items = this.items.filter(function(item) { return !item.checked });
    }
  };

  $rootScope.$watch(function() {return shoppingList}, function() {
    $window.localStorage['items'] = angular.toJson(shoppingList.items);
  }, true)

  return shoppingList;
})


.controller('ShoppingListCtrl', function($scope, ShoppingList) {
  $scope.shoppingList = ShoppingList;

  $scope.addItem = function() {
    ShoppingList.add($scope.newItem);
    $scope.newItem = "";
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
