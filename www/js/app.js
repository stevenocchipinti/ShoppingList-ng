angular.module('shoppinglist', ['ionic'])

.factory('Catalogue', function($window, $rootScope) {
  var catalogue = {
    items: angular.fromJson($window.localStorage['catalogue'] || '[]'),
    add: function(name) {
      name = name.capitalize();
      if (!name.isEmpty() && !this.exists(name)) {
        this.items.push({
          name: name
        });
      }
    },
    names: function() {
      return this.items.map(function(x) { return x.name });
    },
    exists: function(name) {
      return this.names().indexOf(name) >= 0;
    }
  };

  $rootScope.$watch(function() {return catalogue}, function() {
    $window.localStorage['catalogue'] = angular.toJson(catalogue.items);
  }, true)

  return catalogue;
})


.factory('ShoppingList', function($window, $rootScope, Catalogue) {
  var shoppingList = {
    items: angular.fromJson($window.localStorage['shoppingList'] || '[]'),
    add: function(name) {
      name = name.capitalize();
      if (!name.isEmpty() && !this.exists(name)) {
        this.items.push({
          name: name,
          checked: false
        });
        Catalogue.add(name);
      }
    },
    names: function() {
      return this.items.map(function(x) { return x.name });
    },
    exists: function(name) {
      return this.names().indexOf(name) >= 0;
    },
    clearDone: function() {
      this.items = this.items.filter(function(item) { return !item.checked });
    }
  };

  $rootScope.$watch(function() {return shoppingList}, function() {
    $window.localStorage['shoppingList'] = angular.toJson(shoppingList.items);
  }, true)

  return shoppingList;
})


.controller('ShoppingListCtrl', function($scope, ShoppingList, Catalogue) {
  $scope.shoppingList = ShoppingList;
  var newItemElm = $('#newItem');

  $scope.addItem = function(item) {
    ShoppingList.add(item);
    $scope.newItem = "";
    $scope.$broadcast('autocomplete.preventBlur');
  };

  $scope.$watch('newItem', function(text) {
    var suggestions = Catalogue.names();
    $scope.suggestions = [];

    if (text && !text.isEmpty()) {
      var matches = [];
      var substrRegex = new RegExp(text, 'i');
      $.each(suggestions, function(i, str) {
        if (substrRegex.test(str)) {
          matches.push(str);
        }
      });
      $scope.suggestions = matches;
    }
  });


  // Prevent the soft keyboard from disappearing when clicking the "+" button
  // or one of the autocomplete suggestions
  // ref: https://stackoverflow.com/questions/7621711/how-to-prevent-blur-running-when-clicking-a-link-in-jquery
  var keepFocus = false;
  $scope.$on('autocomplete.preventBlur', function() {
    keepFocus = true;
  });
  newItemElm.blur(function() {
    if (keepFocus) {
      newItemElm.focus();
      keepFocus = false;
    }
  });

})


String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};
