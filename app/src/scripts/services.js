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
        if (!priceCat.quantity) priceCat.quantity = 1;
        priceCat.quantity = parseInt(priceCat.quantity);

        var inOrder = this.itemInOrder(menuItem.itemId, priceCat.catCode)

        if (inOrder !== false){
            this.quantity(inOrder, priceCat.quantity);
        } else {

            var i = {
                itemId: menuItem.itemId,
                itemName: menuItem.itemName,
                itemDescription: menuItem.itemDescription,
                priceCatCode: priceCat.catCode,
                basicRate: priceCat.basicRate,
                discount: priceCat.discount,
                quantity: priceCat.quantity,
                instructions: "",
                data: ""
            };

            this.$order.push(i);
        };

        this.$saveOrder();
    };


    this.reduceItem = function (menuItem, priceCat) {
        if (!priceCat.quantity) priceCat.quantity = 1;
        priceCat.quantity = parseInt(priceCat.quantity);

        var inOrder = this.itemInOrder(menuItem.itemId, priceCat.catCode)

        if (inOrder !== false) {
            if (inOrder.quantity <= 1) {
                this.removeItem(this.getOrder().indexOf(inOrder));
            } else {
                this.quantity(inOrder, -priceCat.quantity);
            }
        }

        this.$saveOrder();
    };


    this.quantity = function (item, offset) {
        var quantity = (item.quantity || 0) + offset;
        if (quantity < 1) quantity = 1;
        item.quantity = quantity;
    }

    this.itemInOrder = function (itemId, priceCatCode) {
        var a =  _.findWhere(this.getOrder(), {itemId:itemId, priceCatCode: priceCatCode});
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

