(function () {
    angular.module('votingApp').controller('MenuController', MenuController);

    MenuController.$inject = ['AuthenticationService'];
    function MenuController(AuthenticationService) {
        var menu = this;
        menu.username = AuthenticationService.getUserName();
    }
})();