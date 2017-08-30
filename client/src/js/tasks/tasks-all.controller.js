class TasksAllCtrl {
    constructor(tasksInfo) {
        'ngInject';
        this._tasks = tasksInfo.tasks;
        this._taskCount = tasksInfo.tasksCount;
        // console.log(`TasksAllCtrl - highestOrderNumber: ${tasksInfo.highestOrderNumber}`);
    }    
}

export default TasksAllCtrl;
