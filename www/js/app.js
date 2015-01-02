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
  var newItemElm = $('#newItem');

  $scope.addItem = function(item) {
    ShoppingList.add(item);
    $scope.newItem = "";
  };

  // Prevent the soft keyboard from disappearing when clicking the "+" button
  // ref: https://stackoverflow.com/questions/7621711/how-to-prevent-blur-running-when-clicking-a-link-in-jquery
  var clickedAddButton = false;
  newItemElm.blur(function() {
    newItemElm.val("");
    if (clickedAddButton) {
      newItemElm.focus();
      clickedAddButton = false;
    }
  });
  $('#addItem').click(function() {
    clickedAddButton = true;
  });
  $('.tt-dropdown-menu').click(function() {
    clickedAddButton = true;
  });


  $scope.$watch('newItem', function(text) {
    var suggestions = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
      'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
      'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
      'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
      'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
      'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
      'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
      'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
      'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ];
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

})


String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};
