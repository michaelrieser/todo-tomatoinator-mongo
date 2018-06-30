class NotificationDateTimeInputCtrl {
    constructor($scope, Tasks, TaskNotifications) {
        'ngInject';

        this._$scope = $scope;
        this._Tasks = Tasks;
        this._TaskNotifications = TaskNotifications;

        this.handlingDateTimeInputBlur = false;
    }
    
    handleDateTimeInputBlur() {        
        // Check added as ng-blur being called twice on notification-date-time-input input - unsure why?
        if (!this.handlingDateTimeInputBlur) { 
            this.handlingDateTimeInputBlur = true;
        } else {
            return;
        }
        let tgtTask = this._TaskNotifications.getTaskFromNotification(this.notification);
        this._TaskNotifications.updateTaskAndResolveNotification(tgtTask, 'due').then(
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
