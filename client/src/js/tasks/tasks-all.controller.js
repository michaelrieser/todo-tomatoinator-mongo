class TasksAllCtrl {
    constructor(tasksInfo, Tasks, $scope) {
        'ngInject';
        this.tasksInfo = tasksInfo;
        this._Tasks = Tasks;
        this._$scope = $scope;

        this.tasks = this.getInactiveTasks(tasksInfo.tasks);
        this.activeTask = this.getActiveTask(tasksInfo.tasks);
        this.taskCount = tasksInfo.tasksCount;       
        this.showAddTaskForm = false;

        // Listen for updateTasks event emitted from task.component child controllers
        $scope.$on('updateTasks', (evt, data) => { this.refreshTasks(); });

        // Listen for toggleTaskActive event emitted from task.component child controllers
        $scope.$on('toggleTaskActive', (evt, data) => { this.toggleTaskActive(data); });
    }

    refreshTasks() {
        this._Tasks.query().then(
            (tasksInfo) => this.setRefreshedTasks(tasksInfo.tasks),
            (err) => $state.go('app.home') // TODO: display error message (?)
        );        
    }
    setRefreshedTasks(tasks) { // Note: this functionality couldn't be implemented in refreshTasks() success method ('this' was inaccessible)
        this.activeTask = this.getActiveTask(tasks);
        this.tasks = this.getInactiveTasks(tasks);
    }

    getActiveTask(tasks) {
        return tasks.find( (task) => { return task.isActive; });
    }

    getInactiveTasks(tasks) {
        return tasks.filter( (task) => { if (!task.isActive) { return task; }});
    }

    toggleTaskActive(task) {
        if (this.activeTask && !task.isActive) { // Not currently active task
            this.activeTask.isActive = false;
            this._Tasks.update(this.activeTask).then(
                (success) => {
                    task.isActive = true;
                    this._Tasks.update(task).then(
                        (success) => {
                            // TODO: handle setting of new activeTask and relegating previously activeTask to inactive list in FRONTEND w/o refreshTasks service calls
                            // console.log(this.tasks.indexOf(task));
                            // var tgtActiveTaskIdx = this.tasks.indexOf(task);
                            // this.activeTask = this.tasks.splice(tgtActiveTaskIdx, 1); // Remove task from inactive list and set to activeTask
                            this.refreshTasks();
                        },
                        (failure) => console.log('toggleTaskActive failed')
                    )
                },
                (failure) => {
                    console.log('toggleTaskActive failed');
                }
            )
        } else if (!this.activeTask) { // No currently active task
            task.isActive = true;
            this._Tasks.update(task).then(
                (success) => {
                    var tgtActiveTaskIdx = this.tasks.indexOf(task);
                    this.activeTask = this.tasks.splice(tgtActiveTaskIdx, 1)[0];
                },
                (failure) => console.log('toggleTaskActive failed')
            ) 
        } else if (task.isActive) { // Currently active task
            task.isActive = false;
            this._Tasks.update(task).then(
                (success) => this.refreshTasks(), // TODO: place note based off of whether it is completed
                (failure) => console.log('toggleTaskActive() failed')
            )
        }
    }
}

export default TasksAllCtrl;
