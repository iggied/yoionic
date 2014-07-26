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
        $window.location.href = 'main.html#/coverpage/'+$rootScope.staffId+'/'+tableIndex+'/'+$scope.tables[tableIndex].tableNumber;
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
    $rootScope.customerName = $stateParams.customerName;

    Menus.query( function(data) {
        $scope.menuCat = _.groupBy(data, 'catCode1');
    });

    $scope.selectMenuCategory = function(catCodePara) {
        $state.go('tab.itemlist', {catCode: catCodePara, searchInput: ""});
    };

    $scope.viewOrder = function() {
      $state.go('tab.vieworder');
    };

    $scope.searchItems = function() {
        if ($scope.searchInput) {
            $state.go('tab.itemlist', {catCode: "", searchInput: $scope.searchInput});
        };
    };

    var cleanupFunction = $rootScope.$on('want.to.go.home', function() {
        $rootScope.confirmAndGoHome()
    });

    $scope.$on('$destroy', function() {
      cleanupFunction();
    });

 }])




.controller('ItemListCtrl', ['$scope', 'Menus', '$state', '$stateParams', '$rootScope', '$ionicPopup', '$window', '$filter', 'OrderSvc',
                    function($scope, Menus, $state, $stateParams, $rootScope, $ionicPopup, $window, $filter, OrderSvc) {
    $scope.selectedCatCode = $stateParams.catCode;
    $scope.searchInput = $stateParams.searchInput;
    $scope.orderSvc = OrderSvc;
    $scope.menuItems = [];

    if ($scope.selectedCatCode != "") {
        Menus.query(function (data) {
            $scope.menuItems = [ _.filter(data, function (menuItem) {
                return menuItem.catCode1 === $scope.selectedCatCode
            }) ];
        })
    } else {
        if ($scope.searchInput != "") {
            Menus.query(function (data) {
                $scope.menuItems = _.groupBy( $filter('filter')(data, $scope.searchInput), "catCode1" ) ;
            })
        }
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


.controller('ViewOrderCtrl', ['$scope', '$rootScope', 'OrderSvc', function($scope, $rootScope, OrderSvc) {
    $scope.orderSvc = OrderSvc;

    var cleanupFunction = $rootScope.$on('want.to.go.home', function() {
        $rootScope.confirmAndGoHome()
    });

    $scope.$on('$destroy', function() {
        cleanupFunction();
    });
}])


.controller('CoverPageCtrl', ['$scope', '$state', '$stateParams', '$rootScope',
    function($scope, $state, $stateParams, $rootScope) {
        $rootScope.staffId = $stateParams.staffId;
        $rootScope.selectedTableIndex = $stateParams.selectedTableIndex;
        $rootScope.tableNumber = $stateParams.tableNumber;

        $scope.ShowFirstPage = function(){
            $state.go('firstpage');

        }
    }])


.controller('FirstPageCtrl', ['$scope', '$state', '$ionicModal', '$rootScope', 'LoginSvc', 'Customers',
        function($scope, $state, $ionicModal, $rootScope, LoginSvc, Customers) {

    $rootScope.customerName = '';

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

    $scope.openLoginModal = function() {
        LoginSvc.openLoginModal('tab.menus');
    }

//    $scope.loginSvc = LoginSvc;

/*
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
    $scope.loginLoginModal = function() {
        var customer;
        Customers.query( function(data) {
            customer = _.find(data, function(cust){return cust.loginId == $scope.custLoginInput.mobile && cust.password == $scope.custLoginInput.pin; } );
            if (customer) {
                $rootScope.customerName = customer.customerName;
                $scope.loginModal.hide();
                $state.go('tab.menus');
            }
        });

    };
    $scope.closeLoginModal = function() {
        $scope.loginModal.hide();
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
*/



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


