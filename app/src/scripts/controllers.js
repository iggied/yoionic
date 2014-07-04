'use strict';
angular.module('RestaurantApp.controllers', [])

.controller('LoginCtrl', function($scope, $state) {
    $scope.programName = "i benefit";

        $scope.staffInput = {
        Id: "",
        Pin: ""
    };

    $scope.login = function(){
       $state.go('tables');
    };
})


.controller('TablesCtrl', ['$scope', '$window', 'Tables', function($scope, $window, Tables) {
    $scope.tables = Tables.query();

    $scope.TableSelected = function(tableIndex) {
        $window.location.href = 'main.html#/tab/pets';
    };
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
