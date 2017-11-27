class TasksDisplayCtrl {
    constructor(tasksInfo, Tasks, $scope, $stateParams) {
        'ngInject';
        
        this._Tasks = Tasks;
        this._$scope = $scope;

        this.tasksStatus = $stateParams.status; // 'all' || 'in-progress' || 'completed' || 'team'
        this.displayProject = $stateParams.project;

        // $watch TEST
        // this.activeTask = this._Tasks.activeTask;
        // $scope.$watch(
        //     () => { return this._Tasks.activeTask }, // Value to watch
        //     (newVal) => { // Method to invoke when Value to watch changes
        //         // console.log('changed!');
        //         // console.log(newVal);
        //         this.activeTask = newVal;
        //         console.log('TasksDisplay');
        //         console.log(this.activeTask);
        //     }
        // )
        // END $watch TEST

        // this.tasksInfo = tasksInfo; // QUESTION: set this (and all task values) from resolved binding || from Tasks service value ?
        // this.tasksInfo = this._Tasks.tasksInfo;

        // NOTE: initially tried to set references to Tasks properties here, but changes weren't reflected in view
        // NOTE(con't): *perhaps because new array was being set to .tasks / .activeTask etc.. when Tasks#setRefreshedTasks() was called ?
        // NOTE(con't): perhaps also investigate using $watch (http://stsc3000.github.io/blog/2013/10/26/a-tale-of-frankenstein-and-binding-to-service-values-in-angular-dot-js/) to decouple Model from View
        // this.tasks = this._Tasks.tasks;
        // this.activeTask = this._Tasks.activeTask;
        // this.taskCount = this._Tasks.taskCount;

        this.showAddTaskForm = false;

        this.projectsInfo = $scope.$parent.$ctrl.projectsInfo; // TODO: inject Projects service and assign instead of accessing parent scope (SEE: Tasks service refactor)
    }
}

export default TasksDisplayCtrl;
