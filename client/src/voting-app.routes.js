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
            });
    }
})();