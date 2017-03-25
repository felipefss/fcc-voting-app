(function () {
    'use strict';

    angular.module('votingApp').config(routeConfig);

    routeConfig.$inject = ['$routeProvider'];
    function routeConfig($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'src/home/home.html',
                controller: 'HomeController as homeCtrl'
            })
            .when('/sign-up', {
                templateUrl: 'src/auth/sign-up.html',
                controller: 'SignUpController as signUp'
            })
            .when('/login', {
                templateUrl: 'src/auth/login.html',
                controller: 'LoginController as login'
            });

        $routeProvider.otherwise('/');
    }
})();