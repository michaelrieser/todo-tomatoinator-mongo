class ReminderNotificationCtrl {
    constructor(Tasks, TimeUtils, TaskNotifications, $scope, $mdToast) {
        'ngInject';

        this._Tasks = Tasks;
        this._TimeUtils = TimeUtils;
        this._TaskNotifications = TaskNotifications;
        this._$scope = $scope;

        this.editingdatetime = false;
    }  

    targetDateTimeInPast() {
        return this._TimeUtils.dateTimeInPast(this.notification.targetDateTime);
    }

    clearReminderDateTime() {    
        let tgtTask = this._TaskNotifications.getTaskFromNotification(this.notification);
        tgtTask.reminderDateTime = null;
        // tgtTask.dueDateTimeNotified = '<unsure-what-to-set-here || how-to-handle-this>?' //TODO

        let tgtNotificationId = tgtTask.id
        this._Tasks.updateAndSet(tgtTask).then(
            (updatedTask) => this._TaskNotifications.removeResolvedNotification(tgtNotificationId, 'reminder'),
            (err) => console.log(err)
        )   
    }

    handleEditDateTimeToggle() {
        this.editingdatetime = !this.editingdatetime;
    }
}

let ReminderNotification = {
    bindings: {
        notification: '='
    },
    controller: ReminderNotificationCtrl,
    templateUrl: 'components/notification-helpers/reminder-notification.html'
};

export default ReminderNotification;
