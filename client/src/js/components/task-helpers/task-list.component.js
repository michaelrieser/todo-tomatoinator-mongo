class TaskListCtrl {
    constructor(Tasks, $scope) {
        'ngInject';

        // this._Tasks = Tasks; 
        this.sortableTaskHandlers = {
            start: function (event, ui) {
                console.log('start dragging...');
                console.log(event);
                console.log(ui);
            },
            stop: function (event, ui) {
                console.log('...dropped');
                console.log(ui.item.index());
                // QUESTION: use ui.previousSibling to get order of prior element?
                // find object in list
                // grab order of object prior
                // if order of object prior +1 exists, add 1 
                    // add 1 to each object after (excluding newly updated task)
                    // service call to update affected tasks in backend -> use mongo's $inc method?
                // if not, add 1 to order and update task
            }
        }
    }

}

let TaskList = {
    bindings: {
        tasks: '=',
    },
    controller: TaskListCtrl,
    templateUrl: 'components/task-helpers/task-list.html'
};

export default TaskList;
