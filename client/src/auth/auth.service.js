(function () {
    angular.module('votingApp')
        .service('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$cookies', 'jwtHelper', '$q'];
    function AuthenticationService($cookies, jwtHelper, $q) {
        var service = this;

        function getParsedCookies() {
            if (!$cookies.get('session')) {
                return null;
            }
            var payload = jwtHelper.decodeToken($cookies.get('session'));

            return payload;
        }

        service.getUserName = function() {
            var deferred = $q.defer();
            var cookieData = getParsedCookies();

            return cookieData ? cookieData.user : null;
        };
    }
})();