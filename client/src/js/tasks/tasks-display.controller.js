class TasksDisplayCtrl {
    constructor(tasksInfo, Projects, Tasks, $scope, $stateParams) {
        'ngInject';
        
        this._Tasks = Tasks;
        this._Projects = Projects;
        this._$scope = $scope;

        this.tasksStatus = $stateParams.status; // 'all' || 'in-progress' || 'completed' || 'team'

        // Set displayProject - consumed by add-task-form.component to display default new task & projectHandleSuccess in project component
        if ($stateParams.project) { Projects.displayProject = $stateParams.project };

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

        // Angular UI Sortable TEST
        // this.items = ['one', 'two', 'three'];
        // $scope.items = ['one', 'two', 'three'];
        // $scope.sortableOptions = {
        //     start: function (event, ui) {
        //         console.log('start1');
        //     },
        //     stop: function (event, ui) {
        //         console.log('stop1');
        //     }
        // };

        this.items = [
            {title: 'task 1', order: 1},
            {title: 'task 2', order: 2},
            {title: 'task 3', order: 3}
        ];
        this.sortableHandlers = {
            start: function (event, ui) {                                
                console.log('start dragging...');
                console.log(event);
                console.log(ui);
            },
            stop: function (event, ui) {
                // PRELIMINARY QUESTIONS: 
                    // 1.) do we want to allow user to order tasks by each project?
                    // 2.) still an outstanding issue where TasksService#highestOrderNumber doesn't get updated when task deleted?

                // find object in list
                // grab order of object prior and add 1
                // add 1 to each object after
                // service call to update affected tasks in backend -> use mongo's $inc method?
                console.log('...dropped');
                console.log(event);
                console.log(ui)                                
            }
        };

    }
}

export default TasksDisplayCtrl;
