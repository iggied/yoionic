'use strict';
angular.module('RestaurantApp.services', [])

.factory('Tables', ['$resource',
    function($resource){
        return $resource('res/appdata/Tables.json', {}, {query: {method: 'GET', isArray: true}}
        );
    }
])

.factory('Menus', ['$resource',
    function($resource){
        return $resource('res/appdata/Restaurantmenu.json', {}, {query: {method: 'GET', isArray: true}}
        );
    }
]);


