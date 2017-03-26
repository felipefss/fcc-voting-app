(function () {
    'use strict';

    angular.module('votingApp').controller('HomeController', HomeController);

    HomeController.$inject = ['user', 'polls'];
    function HomeController(user, polls) {
        var homeCtrl = this;
        homeCtrl.user = user;
        homeCtrl.polls = polls;
    }
})();