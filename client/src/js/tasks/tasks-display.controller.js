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
        
        $scope.$watch(
            () => { return this.notifications },
            (newNotifications) => {
                let notificationsLength = newNotifications.dueDateTimeNotifications.length + 
                                          newNotifications.reminderDateTimeNotifications.length;
                if ( notificationsLength > 0 ) { this.displayToast(); }  // QUESION/TODO: is it even necessary to call displayToast() since notifications set via two-way binding?
                else { this._$mdToast.hide(); }            
            },
            true // perform deep watch
        )       

        // Set displayProject - consumed by add-task-form.component to display default new task & projectHandleSuccess in project component
        if ($stateParams.project) { Projects.displayProject = $stateParams.project };        

        this.showAddTaskForm = false;

    }
    displayToast() { 
        this.toastDisplayed = true;
        // SEE: https://material.angularjs.org/latest/demo/toast & https://material.angularjs.org/latest/api/service/$mdToast
        this._$mdToast.show({
            hideDelay: false,            
            // animation: 'fade',
            position: 'bottom left', // TODO: appears to be overriding this and going to bottom, this is OK but probably worth investigating
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
