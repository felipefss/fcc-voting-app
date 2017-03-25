(function () {
    angular.module('votingApp')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['AuthenticationService', '$location', '$rootScope'];
    function LoginController(AuthenticationService, $location, $rootScope) {
        var login = this;

        login.submit = function (event) {
            event.preventDefault();
            var userObj = {
                username: login.name,
                password: login.pass
            };

            AuthenticationService.request('/auth', userObj)
                .then(function (response) {
                    switch (response) {
                        case 200:
                            $rootScope.$broadcast('auth:userLoggedIn');
                            $location.path('/');
                            break;
                        case 401:
                            login.invalidMsg = 'Invalid username/password';
                            login.invalid = true;
                            break;
                        default:
                            login.invalidMsg = 'Internal error';
                            login.invalid = true;
                    }
                });
        };
    }
})();
