class TasksDisplayCtrl {
    constructor(tasksInfo, Tasks, Projects, PomTimer, $scope, $stateParams) {
        'ngInject';

        this._Tasks = Tasks;
        this._Projects = Projects;
        this._PomTimer = PomTimer;
        this._$scope = $scope;

        this.tasksStatus = $stateParams.status; // 'all' || 'in-progress' || 'completed' || 'team'

        this.activeTaskList = [];

        this.startIdx = null;
        this.stopIdx = null;
        this.hoveringActiveTaskList = false;
        this.hoveringInactiveTaskList = false;
        this.sortableOptions = {
            connectWith: '.active-inactive-connected-list',
            // tolerance: 'pointer',
            cancel: '.unsortable,input,textarea,button,select,option',  // NOTE: just setting to '.unsortable' will cause inputs to be unclickable, potentially due to sortable event handler taking precedence
            // distance: 5,
            // forcePlaceholderSize: true,
            placeholder: 'highlighted-task-list', // NOTE: replaced with customized CSS for active/inactive task list, which also remedies
            start: (event, ui) => {
                this.startIdx = ui.item.index();
            },            
            change: (event, ui) => { // NOTE: this event is triggered only when the DOM position has changed during sorting. SEE: http://api.jqueryui.com/sortable/#event-change                
                this._$scope.$apply(
                    (() => {
                        let sourceList = ui.item.sortable.source[0].attributes['data-list'].value;
                        let targetList = event.target.attributes['data-list'].value;

                        if (sourceList === 'inactiveTaskList' && targetList === 'activeTaskList') {
                            this.hoveringInactiveTaskList = false;
                            this.hoveringActiveTaskList = true;
                        } else if (sourceList === 'activeTaskList' && targetList === 'inactiveTaskList') {
                            this.hoveringActiveTaskList = false;
                            this.hoveringInactiveTaskList = true;
                        } else {
                            this.hoveringActiveTaskList = false;
                            this.hoveringInactiveTaskList = false;
                        }
                    })
                )
            },
            stop: (event, ui) => {
                this.stopIdx = ui.item.index();                

                if (this.startIdx === this.stopIdx) { return; }

                this.hoveringActiveTaskList = false;
                this.hoveringInactiveTaskList = false;

                let sourceList = ui.item.sortable.source[0].attributes['data-list'].value;
                let targetList = ui.item.sortable.droptarget[0].attributes['data-list'].value;

                let targetTask = ui.item.sortable.model;

                if (sourceList === 'inactiveTaskList' && targetList === 'activeTaskList') {
                    this._PomTimer.clearAndResetTimer();
                    this._Tasks.toggleTaskActive(targetTask);                    
                } else if (sourceList === 'activeTaskList' && targetList === 'inactiveTaskList') {
                    this._PomTimer.clearAndResetTimer();
                    this._Tasks.toggleTaskActive(targetTask);
                } else if (sourceList === 'activeTaskList' && targetList === 'activeTaskList') {   
                } else if (sourceList === 'inactiveTaskList' && targetList === 'inactiveTaskList') {
                    this._Tasks.updateTasksOrderOnDrop(this.startIdx, this.stopIdx);
                }
            }
        }

        $scope.$watch(
            () => { return this._Tasks.activeTask; },
            (newActiveTask) => {
                this.populateActiveTaskList();
            }
        )
        $scope.$watch(
            () => { return this._Tasks.tasks; },
            (newTasks) => {
                this.populateActiveTaskList();
            }
        )

        // Set displayProject - consumed by add-task-form.component to display default new task & projectHandleSuccess in project component
        if ($stateParams.project) { Projects.displayProject = $stateParams.project };

        this.showAddTaskForm = false;
    }

    populateActiveTaskList() {
        // NOTE: must populate activeTaskList and set to either task or li element in order to make draggable (ui-sortable requires ng-model)
        if (this._Tasks.activeTask) {
            angular.copy([this._Tasks.activeTask], this.activeTaskList);
        } else if (this._Tasks.tasks.length) {
            angular.copy([{ displayText: 'Set active task by dragging task here or clicking it active', elementType: 'li', cssClass: 'task-active-empty' }], this.activeTaskList);
        } else {
            angular.copy([{ displayText: 'Select plus below to add a task', elementType: 'li', cssClass: 'task-list-empty' }], this.activeTaskList);
        }
    }
}

export default TasksDisplayCtrl;
