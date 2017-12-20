class TaskListCtrl {
    constructor(Tasks, $scope) {
        'ngInject';

        this._Tasks = Tasks;
        this.startIdx = null;
        this.stopIdx = null;
        
        // this._Tasks = Tasks; 
        this.sortableTaskHandlers = {
            start: (event, ui) => {
                this.startIdx = ui.item.index();
            },
            stop: (event, ui) => {
                this.stopIdx = ui.item.index();
                this._Tasks.updateTasksOrderOnDrop(this.startIdx, this.stopIdx);
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
