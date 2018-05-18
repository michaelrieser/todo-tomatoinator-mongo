class TaskListCtrl {
    constructor(Tasks, $scope) {
        'ngInject';

        this._Tasks = Tasks;
        
        this.startIdx = null;
        this.stopIdx = null;
    }

    hasZeroTaskLength() {
        return this.tasks.length === 0;
    }

}

let TaskList = {
    bindings: {
        tasks: '=',
        sortableoptions: '=',
        hoveringinactivetasklist: '='
    },
    controller: TaskListCtrl,
    templateUrl: 'components/task-helpers/task-list.html'
};

export default TaskList;
