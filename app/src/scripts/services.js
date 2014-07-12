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
])


.service('OrderSvc', function () {

    this.setOrder = function (order) {
        this.$order = order;
    }

    this.getOrder = function(){
        return this.$order;
    }

    this.addItem = function (menuItem, priceCat) {
        priceCat.quantity = parseInt(priceCat.quantity);

        var i = {
            itemId: menuItem.itemId,
            itemName: menuItem.itemName,
            itemDescription: menuItem.itemDescription,
            basicRate: priceCat.basicRate,
            discount: priceCat.discount,
            quantity: priceCat.quantity,
            instructions: "",
            data: ""
        };

        this.$order.push(i);

        this.$saveOrder(this.$order);
    };

    this.itemInOrder = function (itemId) {
        var a =  _.find(this.getOrder(), {itemId:itemId});
        if (a === undefined) return false
        else return a;
    }

    this.totalLineItems = function () {
        return this.getOrder().length;
    }

    this.getBasicTotal = function(){
        var total = 0;
        angular.forEach(this.getOrder(), function (item) {
            total += (item.basicRate * item.quantity);
        });
        return total;
    }

    this.getDiscountedTotal = function(){
        var total = 0;
        angular.forEach(this.getOrder(), function (item) {
            total += ((item.basicRate-item.discount) * item.quantity);
        });
        return total;
    }



    this.totalCost= function () {
        var tax = (!this.getTax() ? 0 : this.getTax());
        return this.getSubTotal() + tax;
    }



    this.removeItem = function (index) {
        this.$order.splice(index, 1);
        this.$saveOrder(this.$order);
    }

    this.empty = function () {
        this.$order = [];
        localStorage.removeItem('RestaurantOrder');
    }

    this.$saveOrder = function () {
        localStorage.setItem('RestaurantOrder', JSON.stringify(this.getOrder()));

    }

});

