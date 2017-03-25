(function () {
    angular.module('votingApp').controller('MenuController', MenuController);

    MenuController.$inject = ['AuthenticationService', '$http', '$rootScope'];
    function MenuController(AuthenticationService, $http, $rootScope) {
        var menu = this;
        menu.username = AuthenticationService.getUserName();

        var cancelListener = $rootScope.$on('auth:userLoggedIn', function(event) {
            menu.username = AuthenticationService.getUserName();
            console.log('here');
            console.log(event);
        });

        menu.$onDestroy = function() {
            console.log('destroying menu scope');
            cancelListener();
        };
    }
})();