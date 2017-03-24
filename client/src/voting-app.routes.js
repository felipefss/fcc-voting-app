(function () {
    'use strict';
    
    angular.module('votingApp').config(routeConfig);

    routeConfig.$inject = ['$stateProvider'];
    function routeConfig($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'src/home/home.html',
                controller: 'HomeController as homeCtrl'
            })
            .state('signup', {
                url: '/sign-up',
                templateUrl: 'src/auth/sign-up.html',
                controllerAs: 'signUp'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'src/auth/login.html',
                controllerAs: 'login'
            });
    }
})();