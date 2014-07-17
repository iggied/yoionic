'use strict';
angular.module('RestaurantApp.controllers', [])

.controller('LoginCtrl', function($scope, $state, $rootScope) {
    $scope.staffInput = {
        Id: "",
        Pin: ""
    };

    $scope.login = function() {
        $rootScope.staffId = "";

        var staffId = $scope.staffInput.Id, staffPin = $scope.staffInput.Pin;
        var regExId = new RegExp( staffId.substr(1,1), "g");

        if (staffId.length > 4 && staffPin.length > 4 && staffId.replace(regExId, "").length > 0) {
            if (staffPin === staffId.split("").reverse().toString().replace(/,/g, "")) {
                $rootScope.staffId = staffId;
                $state.go('tables');
            };
        };
    };
})


.controller('TablesCtrl', ['$scope', '$rootScope', '$window', 'Tables', function($scope, $rootScope, $window, Tables) {
    $scope.tables = Tables.query();

    $scope.TableSelected = function(tableIndex) {
        $window.location.href = 'main.html#/firstpage/'+$rootScope.staffId+'/'+tableIndex+'/'+$scope.tables[tableIndex].tableNumber;
    };
}])


.controller('MainCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.notifyGoHome = function() {
        $rootScope.$emit('want.to.go.home');
    }
}])




.controller('MenusCtrl', ['$scope', 'Menus', '$state', '$stateParams', '$rootScope', '$ionicPopup', '$window', 'OrderSvc',
                  function($scope, Menus, $state, $stateParams, $rootScope, $ionicPopup, $window, OrderSvc) {
    $scope.orderSvc = OrderSvc;
    $scope.menuCat = {};

    Menus.query( function(data) {
        $scope.menuCat = _.groupBy(data, 'catCode1');
    });

    $scope.selectMenuCategory = function(catCodePara) {
        $state.go('tab.itemlist', {catCode: catCodePara});
    };

    $scope.viewOrder = function() {
      $state.go('tab.vieworder');
    };

    var cleanupFunction = $rootScope.$on('want.to.go.home', function() {
        $rootScope.confirmAndGoHome()
    });

    $scope.$on('$destroy', function() {
      cleanupFunction();
    });

 }])




.controller('ItemListCtrl', ['$scope', 'Menus', '$state', '$stateParams', '$rootScope', '$ionicPopup', '$window', 'OrderSvc',
                    function($scope, Menus, $state, $stateParams, $rootScope, $ionicPopup, $window, OrderSvc) {
    $scope.selectedCatCode = $stateParams.catCode;
    $scope.orderSvc = OrderSvc;
    $scope.menuItems = [];

    Menus.query( function(data) {
        $scope.menuItems = _.filter(data, function(menuItem){return menuItem.catCode1 === $scope.selectedCatCode});
    });

/*
    $scope.addQty = function(priceCat){
        priceCat.quantity = (priceCat.quantity || 0 ) + 1;
        if (priceCat.quantity > 99) {priceCat.quantity = 0; };
    };

    $scope.removeQty = function(priceCat){
        priceCat.quantity = (priceCat.quantity || 0 ) - 1;
        if (priceCat.quantity < 0) {priceCat.quantity = 0; }
    };


    $scope.addItem = function(menuItem, priceCat){
        priceCat.quantity = (priceCat.quantity || 0) + 1 ;
        if (priceCat.quantity > 0 && priceCat.quantity < 100) { OrderSvc.addItem(menuItem, priceCat); };
    };
*/

    $scope.viewOrder = function() {
        $state.go('tab.vieworder');
    };

    var cleanupFunction = $rootScope.$on('want.to.go.home', function() {
        $rootScope.confirmAndGoHome()
    });

    $scope.$on('$destroy', function() {
        cleanupFunction();
    });
}])


.controller('ViewOrderCtrl', ['$scope', '$rootScope', 'OrderSvc', function($scope, $rootScope, OrderSvc) {
    $scope.orderSvc = OrderSvc;

    var cleanupFunction = $rootScope.$on('want.to.go.home', function() {
        $rootScope.confirmAndGoHome()
    });

    $scope.$on('$destroy', function() {
        cleanupFunction();
    });
}])


.controller('FirstPageCtrl', ['$scope', '$state', '$stateParams', '$rootScope', '$ionicModal', '$ionicPopup', '$window',
        function($scope, $state, $stateParams, $rootScope, $ionicModal, $ionicPopup, $window) {
    $rootScope.staffId = $stateParams.staffId;
    $rootScope.selectedTableIndex = $stateParams.selectedTableIndex;
    $rootScope.tableNumber = $stateParams.tableNumber;

    $scope.showMenu = function() {
        $state.go('tab.menus');
    };

    var cleanupFunction = $rootScope.$on('want.to.go.home', function() {
        $rootScope.confirmAndGoHome()
    });

    $scope.$on('$destroy', function() {
        cleanupFunction();
    });

    $scope.customerInput = {
        name: '',
        email: '',
        mobile: '',
        pinCode: '',
        gender: '',
    };

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
;


