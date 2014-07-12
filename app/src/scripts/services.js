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

    this.setTax = function(tax){
        this.$order.tax = tax;
    }

    this.getTax = function(){
        return ((this.getSubTotal()/100) * this.getOrder().tax );
    }

    this.addItem = function (menuItem) {

        var i = {
            itemId: menuItem.itemId,
            price: menuItem.priceCat[0].basicRate,
            quantity: ParseInt(menuItem.qty),
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

    this.totalItems = function () {
        return this.getOrder().length;
    }

    this.getSubTotal = function(){
        var total = 0;
        angular.forEach(this.getOrder(), function (item) {
            total += (item.price * item.quantity);
        });
        return total;
    }


    this.totalCost= function () {
        var tax = (!this.getTax() ? 0 : this.getTax());
        return this.getSubTotal() + tax;
    }

    this.quantity = function (item, offset) {
        var quantity = item.quantity + offset;
        if (quantity < 1) quantity = 1;
        item.quantity = quantity;
        this.$saveOrder();
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

