(function () {
    'use strict';

    angular.module('votingApp').controller('HomeController', HomeController);

    HomeController.$inject = ['$cookies'];
    function HomeController($cookies) {
        var homeCtrl = this;
    }
})();