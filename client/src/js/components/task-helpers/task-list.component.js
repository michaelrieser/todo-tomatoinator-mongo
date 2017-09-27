class TaskListCtrl {
    constructor(Tasks, $scope) {
        'ngInject';

        // this._Tasks = Tasks; 
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
