(function () {
    angular.module('votingApp')
        .service('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$cookies', 'jwtHelper', '$q', '$http'];
    function AuthenticationService($cookies, jwtHelper, $q, $http) {
        var service = this;

        function getParsedCookies() {
            if (!$cookies.get('session')) {
                return null;
            }
            var payload = jwtHelper.decodeToken($cookies.get('session'));

            return payload;
        }

        service.getUserName = function () {
            var cookieData = getParsedCookies();

            return cookieData ? cookieData.user : null;
        };

        service.request = function (path, user) {
            return $http.post(path, user).then(
                function (response) {
                    return response.status;
                },
                function (rejection) {
                    return rejection.status;
                }
            );
        };
    }
})();