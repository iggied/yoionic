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

        function calcDiscount(response) {
            var key1, key2, data = response.data;
            for (key1 in data) {
                for (key2 in data[key1].priceCat) {
                    data[key1].priceCat[key2].discountRate = Math.round(data[key1].priceCat[key2].basicRate * 0.85);
                }
            }

            return response.resource;
        }


        return $resource('res/appdata/Restaurantmenu.json', {},
            {query: {method: 'GET', isArray: true, interceptor: {response: calcDiscount }}}
        );
    }
])


.factory('Customers', ['$resource',
    function($resource){
        return $resource('res/appdata/customers.json', {}, {query: {method: 'GET', isArray: true}}
        );
    }
])

.service('CustomerSvc', ['$window',
    function($window){

        this.getCustomer = function( mobile ) {
            return angular.fromJson(localStorage.getItem('cust.' + mobile));
        }

        this.setCustomer = function( customer ) {
            localStorage.setItem('cust.' + customer.mobile, JSON.stringify(customer));
        }

        this.checkLogin = function( mobile, surName ) {
            var cust = this.getCustomer( mobile );
            return ( cust.mobile == mobile && cust.surName == surName );
        }


    }
])

.service('LoginSvc', ['$state', '$rootScope', '$ionicModal', 'CustomerSvc',
            function ($state, $rootScope, $ionicModal, CustomerSvc) {

    this.setLoginModal = function(modal) {
        this.loginModal = modal;
    };

    this.getLoginModal = function(){
        return this.loginModal
    };

    this.initialize = function() {
        var parent = this;
        $ionicModal.fromTemplateUrl('login-modal.html', {
            scope: $rootScope,
            animation: 'slide-in-up',
            focusFirstInput: true
        }).then(function (modal) {
            parent.setLoginModal(modal);

            modal.scope.close = function() {
                modal.hide();
            };

            modal.scope.custLoginInput = {
                mobile: '',
                pin: ''};

            modal.scope.login = function() {
                if (CustomerSvc.checkLogin(modal.scope.custLoginInput.mobile, modal.scope.custLoginInput.pin )) {
                    $rootScope.customerName = CustomerSvc.getCustomer(modal.scope.custLoginInput.mobile).firstName;
                    modal.hide();
                    $state.go(parent.getNextState(), {customerName: $rootScope.customerName, clearHistory: true});
                }
            };


        });
    };

    this.setNextState = function(state) {
        this.nextState = state;
    };

    this.getNextState = function() {
        return this.nextState;
    }

    this.openLoginModal = function(nextState) {
        this.setNextState( nextState );
        this.loginModal.show();
    };



/*
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            this.loginModal.remove();
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


    }])





.service('RegisterSvc', ['$state', '$rootScope', '$ionicModal', 'CustomerSvc',
                function ($state, $rootScope, $ionicModal, CustomerSvc) {

    this.setRegisterModal = function(modal) {
        this.registerModal = modal;
    };

    this.getRegisterModal = function(){
        return this.registerModal
    };

    this.initialize = function() {
        var parent = this;
        $ionicModal.fromTemplateUrl('register-modal.html', {
            scope: $rootScope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            parent.setRegisterModal(modal);

            modal.scope.close = function() {
                modal.hide();
            };

            modal.scope.customerInput = {
                firstName: '',
                surName: '',
                email: '',
                mobile: '',
                pinCode: '',
                gender: '',
            };

            modal.scope.register = function() {
                CustomerSvc.setCustomer(modal.scope.customerInput);
//                $rootScope.customerName = modal.scope.customerInput.firstName;
                modal.hide();
                $state.go('firstpage.registercomplete', {customerName: modal.scope.customerInput.firstName});
            };

            modal.scope.skipToMenu = function() {
                modal.hide();
                $state.go('tab.menus', {customerName: modal.scope.customerInput.firstName});
            };
        });
    };


    this.setNextState = function(state) {
        this.nextState = state;
    };

    this.getNextState = function() {
        return this.nextState;
    }

    this.openRegisterModal = function(nextState) {
        this.setNextState( nextState );
        this.registerModal.show();
    };

}])



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
                discountRate: priceCat.discountRate,
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
            total += ((item.discountRate) /*-item.discount)*/ * item.quantity);
        });
        return Math.round(total);
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

