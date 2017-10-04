class TasksAllCtrl {
    constructor(tasksInfo, Tasks, $scope) {
        'ngInject';
        this._Tasks = Tasks;
        this._tasks = this.getInactiveTasks(tasksInfo.tasks);
        this._activeTask = this.getActiveTask(tasksInfo.tasks);
        this._taskCount = tasksInfo.tasksCount;       
        this._$scope = $scope; 
        
        // Listen for updateTasks event emitted from task.component child controllers
        $scope.$on('updateTasks', (evt, data) => { this.refreshTasks(); });
    }

    refreshTasks() {
        this._Tasks.query().then(
            (tasksInfo) => this.setRefreshedTasks(tasksInfo.tasks),
            (err) => $state.go('app.home') // TODO: display error message (?)
        );        
    }
    setRefreshedTasks(tasks) { // Note: this functionality couldn't be implemented in refreshTasks() success method ('this' was inaccessible)
        this._activeTask = this.getActiveTask(tasks);
        this._tasks = this.getInactiveTasks(tasks);
    }

    getActiveTask(tasks) {
        return tasks.find( (task) => { return task.isActive; });
    }

    getInactiveTasks(tasks) {
        return tasks.filter( (task) => { if (!task.isActive) { return task; }});
    }
}

export default TasksAllCtrl;
