class TasksAllCtrl {
    constructor(tasksInfo) {
        'ngInject';
        this._tasks = this.getInactiveTasks(tasksInfo.tasks);
        this._activeTask = this.getActiveTask(tasksInfo.tasks);
        this._taskCount = tasksInfo.tasksCount;        
        console.log(this._tasks);
        // console.log(`TasksAllCtrl - highestOrderNumber: ${tasksInfo.highestOrderNumber}`);
    }

    getActiveTask(tasks) {
        return tasks.find( (task) => { return task.isActive; });
    }

    getInactiveTasks(tasks) {
        return tasks.filter( (task) => { if (!task.isActive) { return task; }});
    }
}

export default TasksAllCtrl;
