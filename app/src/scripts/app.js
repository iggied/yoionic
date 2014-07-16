// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
'use strict';
angular.module('RestaurantApp', ['ngResource','ionic', 'RestaurantApp.services', 'RestaurantApp.controllers'])


.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'src/tabs.html'
    })


    .state('login', {
      url: '/login',
      views: {
          '@': {
              templateUrl: 'login.html',
              controller: 'LoginCtrl'
          }
      }
    })

    .state('tables', {
      url: '/tables',
      views: {
          '@': {
              templateUrl: 'tables.html',
              controller: 'TablesCtrl'
          }
      }
    })

    .state('firstpage', {
      url: '/firstpage/:staffId/:selectedTableIndex/:tableNumber',
      views: {
          '@': {
              templateUrl: 'firstpage.html',
              controller: 'FirstPageCtrl'
          }
      }
    })

    .state('tab.menus', {
      url: '/menus',
      views: {
          'menu-tab': {
              templateUrl: 'menus.html',
              controller: 'MenusCtrl'
          }
      }
    })

    .state('tab.itemlist', {
      url: '/itemlist/:catCode',
      views: {
          'menu-tab': {
              templateUrl: 'menu-itemlist.html',
              controller: 'ItemListCtrl'
          }
      }
    })

      .state('tab.vieworder', {
          url: '/vieworder',
          views: {
              'menu-tab': {
                  templateUrl: 'view-order.html',
                  controller: 'ViewOrderCtrl'
              }
          }
      })



    .state('tab.chefcorner', {
    url: '/chefcorner',
    views: {
      'chef-corner': {
          templateUrl: 'chefcorner.html'
      }
    }
    })

    .state('tab.softdrinks', {
      url: '/softdrinks',
      views: {
          'soft-drinks': {
              templateUrl: 'softdrinks.html'
          }
      }
    })

    .state('tab.barcounter', {
      url: '/barcounter',
      views: {
          'bar-counter': {
              templateUrl: 'barcounter.html'
          }
      }
    })

    .state('tab.specialoffer', {
      url: '/specialoffer',
      views: {
          'special-offer': {
              templateUrl: 'specialoffer.html'
          }
      }
    })

    .state('tab.myfavourites', {
      url: '/myfavourites',
      views: {
          'myfavourites': {
              templateUrl: 'myfavourites.html'
          }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

})

.run(function($rootScope, $ionicPlatform, $ionicPopup, $window, OrderSvc) {
    $rootScope.programName = 'i benefit';
    $ionicPlatform.ready(function() {
        if(window.StatusBar) {
            StatusBar.styleDefault();
            //StatusBar.show();
        }
    });

//   $ionicPlatform.fullScreen( true, false);

   OrderSvc.setOrder([]);

    $rootScope.confirmAndGoHome =  function() {
        $ionicPopup.confirm({
            title: 'Done',
            template: 'Are you sure?'
        })
        .then(function (res) {
            if (res) {
                $window.location.href = 'index.html';
            }
            ;
        })
    };
})

.directive('ibenefitSavings', function() {
        return {
            restrict: 'E',
            scope: {},
            templateUrl: 'ibenefit-savings.html',
            link: function(scope) {
                scope.totalSavings = function () {
                    var restTotal = scope.avgSpendsAtRestaurants * scope.noOfVisits * 12;
                    var homeTotal = scope.avgSpendsOnHomeOrder * scope.noOfHomeOrders * 12;

                    return ((isNaN(restTotal)?0:restTotal) + (isNaN(homeTotal)?0:homeTotal)) * .15;
                }
            }
        };
    }
)

.directive('orderDetails', function(OrderSvc) {
    return {
        restrict : 'E',
        controller : ['$scope', '$rootScope',  function($scope, $rootScope){
            $scope.orderSvc = OrderSvc;
            $scope.programName = $rootScope.programName;

            $scope.removeItem = function(index){
                OrderSvc.removeItem(index) ;
            };
        }],
        scope: {},
        templateUrl: 'order-details.html',
        link:function(scope, element, attrs){

        }
    };
});

