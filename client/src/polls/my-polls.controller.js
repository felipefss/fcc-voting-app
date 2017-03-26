(function () {
    angular.module('votingApp')
        .controller('MyPollsController', MyPollsController);

    MyPollsController.$inject = ['polls'];
    function MyPollsController(polls) {
        var myPolls = this;
        myPolls.polls = polls;
    }
})();