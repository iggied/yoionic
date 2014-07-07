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

.controller('MenusCtrl', ['$scope', 'Menus', function($scope, Menus) {
    $scope.menuCat = {};

    $scope.menus = Menus.query( function(data) {
        $scope.menuCat = _.groupBy(data, 'catCode1');
    });

}])

.controller('FirstPageCtrl', ['$scope', '$stateParams', '$rootScope', function($scope, $stateParams, $rootScope) {
    $rootScope.staffId = $stateParams.staffId;
    $rootScope.selectedTable = $stateParams.selectedTable;
    $rootScope.tableNumber = $stateParams.tableNumber;

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
