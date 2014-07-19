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
      url: '/itemlist/:catCode/:searchInput',
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

        $ionicPlatform.fullScreen( true, false);

    });


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
                    var bothTotal = parseInt(((isNaN(restTotal)?0:restTotal) + (isNaN(homeTotal)?0:homeTotal)) * .15) ;


                    if (bothTotal === 0) {
                        return "My savings calculator" ;
                    } else {
                        return "I can save " + bothTotal + "* in a year";
                    }
                };

                scope.lastTouched = "";

                scope.touchedASR = function() {
                    scope.lastTouched = scope.lastTouched == "ASR" ? "" : "ASR";
                };

                scope.touchedNVR = function() {
                    scope.lastTouched = scope.lastTouched == "NVR" ? "" : "NVR";
                };

                scope.touchedASH = function() {
                    scope.lastTouched = scope.lastTouched == "ASH" ? "" : "ASH";
                };

                scope.touchedNVH = function() {
                    scope.lastTouched = scope.lastTouched == "NVH" ? "" : "NVH";
                };

                scope.calcTouched = function(key) {
                    var fieldVal = '' ;

                    switch (scope.lastTouched) {
                        case 'ASR' : fieldVal = scope.avgSpendsAtRestaurants; break;
                        case 'NVR' : fieldVal = scope.noOfVisits; break;
                        case 'ASH' : fieldVal = scope.avgSpendsOnHomeOrder; break;
                        case 'NVH' : fieldVal = scope.noOfHomeOrders; break;
                    }


                    switch (key) {
                        case '.' :
                            if (fieldVal.length > 1) {
                                fieldVal = fieldVal.substr(0, fieldVal.length - 1);
                            } else {
                                fieldVal = "";
                            }
                            break;
                        case 'X': scope.lastTouched = "";
                            break;
                        default : fieldVal = (fieldVal || "") + key;
                            break;
                    }

                    switch (scope.lastTouched) {
                        case 'ASR' : scope.avgSpendsAtRestaurants = fieldVal; break;
                        case 'NVR' : scope.noOfVisits = fieldVal;  break;
                        case 'ASH' : scope.avgSpendsOnHomeOrder = fieldVal; break;
                        case 'NVH' : scope.noOfHomeOrders = fieldVal; break;
                    }


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

            $scope.addItem = function(index){
                OrderSvc.quantity(OrderSvc.getOrder()[index], 1) ;
                OrderSvc.$saveOrder();
            };

            $scope.reduceItem = function(index){
                if (OrderSvc.getOrder()[index].quantity <= 1) {
                    OrderSvc.removeItem(index) ;
                } else {
                    OrderSvc.quantity(OrderSvc.getOrder()[index], -1) ;
                }
                OrderSvc.$saveOrder();
            };
        }],
        scope: {},
        templateUrl: 'order-details.html',
        link:function(scope, element, attrs){

        }
    };
})

.filter('objectToArray', function () {

    return function (obj) {
        if (!(obj instanceof Object)) {
            return obj;
        }

        return Object.keys(obj).map(function (key) {
            return Object.defineProperty(obj[key], '$key', {__proto__: null, value: key});
        });
    }
});


