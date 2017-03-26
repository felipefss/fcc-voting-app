(function () {
    angular.module('votingApp')
        .controller('PollController', PollController);

    PollController.$inject = ['pollId', 'PollsService'];
    function PollController(pollId, PollsService) {
        var poll = this;
        
        PollsService.getPoll(pollId).then(
            function (pollInfo) {
                poll.title = pollInfo.title;
                poll.options = pollInfo.options;
                
                poll.pollPreview.data.rows = PollsService.organizeChartData(poll.options);
            }
        );

        poll.submit = function () {
            if (poll.choiceIndex !== null) {
                poll.options[poll.choiceIndex].votes++;
                PollsService.computeVote(pollId, poll.options).then(
                    function (response) {
                        if (!response) {
                            poll.options[poll.choiceIndex].votes--;
                            //SHOW ERROR - VOTE AGAIN
                        }
                        poll.pollPreview.data.rows = PollsService.organizeChartData(poll.options);
                    }
                );
            }
        };

        poll.pollPreview = {
            type: 'PieChart'
        };

        poll.pollPreview.data = {
            cols: [
                { id: 'op', label: 'Option', type: 'string' },
                { id: 'vt', label: 'Votes', type: 'number' }
            ],
            rows: []
        };
    }
})();