'use strict';
angular.module('RestaurantApp.controllers', [])

.controller('LoginCtrl', function($scope, $state, $rootScope) {
    $scope.staffInput = {
        Id: "",
        Pin: ""
    };

    $scope.login = function(){
       $rootScope.staffId = $scope.staffInput.Id;
       $state.go('tables');
    };
})


.controller('TablesCtrl', ['$scope', '$rootScope', '$window', 'Tables', function($scope, $rootScope, $window, Tables) {
    $scope.tables = Tables.query();

    $scope.TableSelected = function(tableIndex) {
        $window.location.href = 'main.html#/firstpage/'+$rootScope.staffId+'/'+tableIndex+'/'+$scope.tables[tableIndex].tableNumber;
    };
}])

.controller('MenusCtrl', ['$scope', 'Menus', '$state', '$stateParams', function($scope, Menus, $state, $stateParams) {
    $scope.menuCat = {};

    $scope.menus = Menus.query( function(data) {
        $scope.menuCat = _.groupBy(data, 'catCode1');
    });

    $scope.selectMenuCategory = function(catCodePara) {
        $state.go('tab.itemlist', {catCode: catCodePara})
    }
}])

.controller('ItemListCtrl', ['$scope', 'Menus', '$state', '$stateParams', function($scope, Menus, $state, $stateParams) {
    $scope.selectedCatCode = $stateParams.catCode;
    $scope.menuItems = [];

    Menus.query( function(data) {
        $scope.menuItems = _.filter(data, function(menuItem){return menuItem.catCode1 === $scope.selectedCatCode});
    });
}])



.controller('FirstPageCtrl', ['$scope', '$state', '$stateParams', '$rootScope', '$ionicModal',
                              function($scope, $state, $stateParams, $rootScope, $ionicModal) {
    $rootScope.staffId = $stateParams.staffId;
    $rootScope.selectedTable = $stateParams.selectedTable;
    $rootScope.tableNumber = $stateParams.tableNumber;

    $scope.showTestMenu = function() {
        $state.go('tab.menus');
    };

    $scope.customerInput = {
        name: '',
        email: '',
        mobile: '',
        pinCode: '',
        gender: '',
    }

    $ionicModal.fromTemplateUrl('login-modal.html', {
        scope: $scope,
        animation: 'slide-in-up',
        focusFirstInput: true
    }).then(function(modal) {
        $scope.loginModal = modal;
    });
    $scope.openLoginModal = function() {
        $scope.loginModal.show();
    };
    $scope.closeLoginModal = function() {
        $scope.loginModal.hide();
        if (true) {  //Logged in
            $state.go('tab.menus');
        }
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.loginModal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });

    $ionicModal.fromTemplateUrl('register-modal.html', {
      scope: $scope,
      animation: 'slide-in-up',
      focusFirstInput: true
    }).then(function(modal) {
      $scope.registerModal = modal;
    });
    $scope.openRegisterModal = function() {
      $scope.registerModal.show();
    };
    $scope.closeRegisterModal = function() {
      $scope.registerModal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.registerModal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });

}])


// A simple controller that fetches a list of data from a service
.controller('PetIndexCtrl', function($scope, PetService) {
  // "Pets" is a service returning mock data (services.js)
  $scope.pets = PetService.all();
})


// A simple controller that shows a tapped item's data
.controller('PetDetailCtrl', function($scope, $stateParams, PetService) {
  // "Pets" is a service returning mock data (services.js)
  $scope.pet = PetService.get($stateParams.petId);
});
