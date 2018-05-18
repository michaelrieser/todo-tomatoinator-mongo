class TasksDisplayCtrl {
    constructor(tasksInfo, taskNotificationInfo, Projects, Tasks, TaskNotifications, $scope, $stateParams, $mdToast) {
        'ngInject';

        this._Tasks = Tasks;
        this._Projects = Projects;
        this._TaskNotifications = TaskNotifications;
        this._$scope = $scope;
        this._$mdToast = $mdToast;

        this.tasksStatus = $stateParams.status; // 'all' || 'in-progress' || 'completed' || 'team'

        this.notifications = this._TaskNotifications.notifications;
        this.toastDisplayed = false;

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
                    this._Tasks.toggleTaskActive(targetTask);
                } else if (sourceList === 'activeTaskList' && targetList === 'inactiveTaskList') {
                    this._Tasks.toggleTaskActive(targetTask);
                } else if (sourceList === 'activeTaskList' && targetList === 'activeTaskList') {   
                } else if (sourceList === 'inactiveTaskList' && targetList === 'inactiveTaskList') {
                    this._Tasks.updateTasksOrderOnDrop(this.startIdx, this.stopIdx);
                }
            }
        }

        $scope.$watch(
            () => { return this.notifications },
            (newNotifications) => {
                let notificationsLength = newNotifications.dueDateTimeNotifications.length +
                    newNotifications.reminderDateTimeNotifications.length;
                if (notificationsLength > 0) { this.displayToast(); }  // QUESION/TODO: is it even necessary to call displayToast() since notifications set via two-way binding?
                else { this._$mdToast.hide(); }
            },
            true // perform deep watch
        )

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

    displayToast() {
        this.toastDisplayed = true;
        // SEE: https://material.angularjs.org/latest/demo/toast & https://material.angularjs.org/latest/api/service/$mdToast
        this._$mdToast.show({
            hideDelay: false,
            // animation: 'fade',
            // position: 'bottom left', // TODO: appears to be overriding this and going to bottom, this is OK but probably worth investigating
            controller: 'ToastCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'toast/toast.html',
            locals: {
                notifications: this.notifications,
                // toastDisplayed: this.toastDisplayed
            },
            bindToController: true
        }).then(
            (resolvedPromise) => { this.toastDisplayed = false; }
            );
    };
}

export default TasksDisplayCtrl;
