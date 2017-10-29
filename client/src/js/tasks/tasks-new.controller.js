class TasksNewCtrl {
    constructor(tasksInfo, Tasks, $state) {
        'ngInject';

        this._Tasks = Tasks;
        this._$state = $state; 
        this.tasksInfo = tasksInfo; 
        this.showAddTaskForm = false;
    }
}

export default TasksNewCtrl;
