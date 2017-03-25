(function () {
    angular.module('votingApp')
        .controller('SignUpController', SignUpController);

    SignUpController.$inject = ['AuthenticationService', '$location', '$rootScope'];
    function SignUpController(AuthenticationService, $location, $rootScope) {
        var signUp = this;

        signUp.submit = function (event) {
            event.preventDefault();
            var userObj = {
                username: signUp.name,
                password: signUp.pass
            };

            AuthenticationService.request('/register', userObj)
                .then(function (response) {
                    switch (response) {
                        case 201:
                            $rootScope.$broadcast('auth:userLoggedIn');
                            $location.path('/');
                            break;
                        case 401:
                            signUp.invalidMsg = 'Username already exists';
                            signUp.invalid = true;
                            break;
                        default:
                            signUp.invalidMsg = 'Internal error';
                            signUp.invalid = true;
                    }
                });
        };
    }
})();
