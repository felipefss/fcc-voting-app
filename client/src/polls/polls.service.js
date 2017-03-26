(function () {
    angular.module('votingApp')
        .service('PollsService', PollsService);

    PollsService.$inject = ['$http', 'AuthenticationService', '$q'];
    function PollsService($http, AuthenticationService, $q) {
        var service = this;

        function prepPollObj(title, options) {
            var obj = {
                user: AuthenticationService.getUserName(),
                title: title
            };

            for (var i = 0; i < options.length; i++) {
                if (options[i].option === null) {
                    options.splice(i--, 1);
                    continue;
                }
                delete options[i].placeHolder;
                options[i].votes = 0;
            }
            obj.options = options;

            return obj;
        }

        service.computeVote = function (id, options) {
            var payload = {
                id: id,
                options: options
            };
            return $http.post('/compute-vote', payload).then(
                function (response) {
                    return true;
                },
                function (reason) {
                    return false;
                }
            );
        };

        service.createPoll = function (title, options) {
            var payload = prepPollObj(title, options);

            return $http.post('/create-poll', payload).then(
                function (response) {
                    return response;
                },
                function (reason) {
                    return reason;
                }
            );
        };

        service.deletePoll = function(id) {
            return $http.delete('/poll/' + id).then(
                function (response) {
                    return response.status;
                },
                function (reason) {
                    return reason.status;
                }
            );
        };

        service.getAll = function () {
            return $http.get('/get-polls').then(
                function (response) {
                    return response.data;
                },
                function (reason) {
                    return null;
                }
            );
        };

        service.getUserPolls = function () {
            var username = AuthenticationService.getUserName();

            return $http.get('/user-polls/' + username).then(
                function (response) {
                    return response.data;
                },
                function (reason) {
                    return null;
                }
            );
        };

        service.getPoll = function (id) {
            return $http.get('/poll/' + id).then(
                function (response) {
                    return response.data;
                },
                function (reason) {
                    return null;
                }
            );
        };

        service.isEmpty = function (options) {
            var count = 0;
            for (var i = 0; i < options.length; i++) {
                if (options[i].option === null || options[i].option === '') {
                    count++;
                }
            }

            return count === options.length;
        };

        service.organizeChartData = function (votes) {
            var rows = [];

            for (var i = 0; i < votes.length; i++) {
                var elem = {
                    c: [
                        { v: votes[i].option },
                        { v: votes[i].votes }
                    ]
                };
                rows.push(elem);
            }

            return rows;
        };
    }
})();