(function () {
    'use strict';

    angular.module('votingApp', ['ui.router', 'ngCookies', 'angular-jwt'])
        .config(config);

    config.$inject = ['$urlRouterProvider'];
    function config($urlRouterProvider) {
        // If user goes to a path that doesn't exist, redirect to public root
        $urlRouterProvider.otherwise('/');
    }
})();