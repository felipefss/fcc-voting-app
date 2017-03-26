(function () {
    angular.module('votingApp')
        .component('allPolls', {
            templateUrl: 'src/polls/all-polls.html',
            bindings: {
                polls: '<',
                myPolls: '<'
            },
            controller: AllPollsController
        });

    AllPollsController.$inject = ['PollsService'];
    function AllPollsController(PollsService) {
        var $ctrl = this;

        $ctrl.deleteItem = function (index) {
            PollsService.deletePoll($ctrl.polls[index].id).then(
                function (response) {
                    if (response === 200) {
                        $ctrl.polls.splice(index, 1);
                    }
                }
            );
        };
    }
})();