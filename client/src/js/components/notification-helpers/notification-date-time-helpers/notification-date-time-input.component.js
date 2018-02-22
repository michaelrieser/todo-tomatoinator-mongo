class NotificationDateTimeInputCtrl {
    constructor($scope, Tasks, TaskNotifications) {
        'ngInject';

        this._$scope = $scope;
        this._Tasks = Tasks;
        this._TaskNotifications = TaskNotifications;

        this.handlingDateTimeInputBlur = false;

        this._$scope.$watch( () => { return this.handlingDateTimeInputBlur},
                              (newVal) => console.log(`this.handlingDateTimeInputBlur: ${this.handlingDateTimeInputBlur}`) 
                            )
    }
    
    // TODO/QUESTION: remove this + glyph on notification since there is already an X on the far right?
    removeNotificationDate() {

        let tgtTask = this._TaskNotifications.getTaskFromNotification(this.notification);
        if (notification.type === 'due') {
            tgtTask.dueDateTime = null;
        } else {
            tgtTask.reminderDateTime = null;
        }
        // tgtTask.dueDateTimeNotified = '<unsure-what-to-set-here || how-to-handle-this>?' //TODO

        this._TaskNotifications.updateTaskAndNotification(tgtTask, 'due'); // QUESTION => bad practice to call Task service methods from Notification?
    }

    handleDateTimeInputBlur() {        
        // Check added as ng-blur being called twice on notification-date-time-input input - unsure why?
        if (!this.handlingDateTimeInputBlur) { 
            this.handlingDateTimeInputBlur = true;
        } else {
            return;
        }
        // START => date time is closing when date is selected on date picker + figure out WTSH is goin on hur
        let tgtTask = this._TaskNotifications.getTaskFromNotification(this.notification);
        this._TaskNotifications.updateTaskAndNotification(tgtTask, 'due').then(
            (success) => { this.editingdatetime = false; // updates parent due to passed two-way binding
                           this.handlingDateTimeInputBlur = false;
                  },
            (err) => console.log(err)
        );
    }
}

let NotificationDateTimeInput =  {
    bindings: {
        notification: '=',
        editingdatetime: '='
    },
    controller: NotificationDateTimeInputCtrl,
    templateUrl: 'components/notification-helpers/notification-date-time-helpers/notification-date-time-input.html'
};

export default NotificationDateTimeInput;
