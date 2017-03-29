(function () {
    'use strict';

    angular.module('votingApp').config(routeConfig);

    routeConfig.$inject = ['$routeProvider'];
    function routeConfig($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'src/home/home.html',
                controller: 'HomeController as homeCtrl',
                resolve: {
                    user: ['AuthenticationService', function (AuthenticationService) {
                        return AuthenticationService.getUserName();
                    }],
                    polls: ['PollsService', function (PollsService) {
                        return PollsService.getAll();
                    }]
                }
            })
            .when('/login', {
                templateUrl: 'src/auth/login.html',
                controller: 'LoginController as login'
            })
            .when('/my-polls', {
                templateUrl: 'src/polls/my-polls.html',
                controller: 'MyPollsController as myPolls',
                resolve: {
                    polls: ['PollsService', function (PollsService) {
                        return PollsService.getUserPolls();
                    }]
                }
            })
            .when('/new-poll', {
                templateUrl: 'src/polls/new-poll.html',
                controller: 'NewPollController as newPoll'
            })
            .when('/view-poll/:id', {
                templateUrl: 'src/polls/view-poll.html',
                controller: 'PollController as poll',
                resolve: {
                    pollId: ['$route', function ($route) {
                        return $route.current.params.id;
                    }]
                }
            })
            .when('/sign-up', {
                templateUrl: 'src/auth/sign-up.html',
                controller: 'SignUpController as signUp'
            });

        $routeProvider.otherwise('/');
    }
})();