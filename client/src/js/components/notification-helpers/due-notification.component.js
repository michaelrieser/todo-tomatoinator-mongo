class DueNotificationCtrl {
    constructor(Tasks, TimeUtils, TaskNotifications, $scope) {
        'ngInject';

        this._Tasks = Tasks;
        this._TimeUtils = TimeUtils;
        this._TaskNotifications = TaskNotifications;
        this._$scope = $scope;

        this.editingdatetime = false;

        // clone array to preclude respective notification in TaskNotification service from being updated until user blurs input
        //  => SEE: https://stackoverflow.com/questions/36124363/deep-copying-objects-in-angular
        //  => TODO: see TODO in bindings below regarding one-way bindings (prolly a better way to go)
        this.notification = JSON.parse(JSON.stringify(this.notification)); 
    }

    targetDateTimeInPast() {
        return this._TimeUtils.dateTimeInPast(this.notification.targetDateTime);
    }

    clearDueDateTime() {
        let tgtTask = this._TaskNotifications.getTaskFromNotification(this.notification);
        tgtTask.dueDateTime = null;
        // tgtTask.dueDateTimeNotified = '<unsure-what-to-set-here || how-to-handle-this>?' //TODO

        let tgtNotificationId = tgtTask.id
        this._TaskNotifications.updateTaskAndNotification(tgtTask, 'due'); // QUESTION => bad practice to call Task service methods from Notification?
    }

    handleEditDateTimeToggle() {
        this.editingdatetime = !this.editingdatetime;
    }
}

let DueNotification = {
    bindings: {
        notification: '='
        //  TODO: upgrade to latest version of AngularJS 1.x in order for one way binding below to work
        // notification: '<' // one-way data binding - attempt to prevent respective notification in TaskNotification from being updated until user blurs(resolves) it
    },
    controller: DueNotificationCtrl,
    templateUrl: 'components/notification-helpers/due-notification.html'
};

export default DueNotification;
