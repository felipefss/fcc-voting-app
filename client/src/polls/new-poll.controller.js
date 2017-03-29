(function () {
    angular.module('votingApp')
        .controller('NewPollController', NewPollController);

    NewPollController.$inject = ['PollsService', '$location'];
    function NewPollController(PollsService, $location) {
        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });

        var newPoll = this;
        newPoll.options = [
            {
                option: null,
                placeHolder: 'Iron Man'
            },
            {
                option: null,
                placeHolder: 'Captain America'
            }
        ];

        newPoll.addNewOption = function () {
            newPoll.options.push({
                option: null,
                placeHolder: 'Someone else, then'
            });
            $('[data-toggle="tooltip"]').tooltip('hide');
        };

        newPoll.removeOption = function (index) {
            newPoll.options.splice(index, 1);
        };

        newPoll.submit = function () {
            if (newPoll.options.length < 2 || PollsService.isEmpty(newPoll.options)) {
                newPoll.invalid = true;
                return;
            }
            
            PollsService.createPoll(newPoll.title, newPoll.options)
                .then(function (response) {
                    if (response.status !== 200) {
                        newPoll.error = true;
                    } else {
                        $location.path('/view-poll/' + response.data);
                    }
                });
        };
    }
})();