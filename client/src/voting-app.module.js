(function () {
    'use strict';

    angular.module('votingApp', ['ngRoute', 'ngCookies', 'angular-jwt'])
        .config(config);

    config.$inject = ['$locationProvider', '$compileProvider'];
    function config($locationProvider, $compileProvider) {
        $locationProvider.html5Mode(true);

        $compileProvider.debugInfoEnabled(false);
        $compileProvider.commentDirectivesEnabled(false);
        $compileProvider.cssClassDirectivesEnabled(false);
    }
})();