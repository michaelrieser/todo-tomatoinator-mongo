class ReminderNotificationCtrl {
    constructor(Tasks, TimeUtils, $scope) {
        'ngInject';

        this._Tasks = Tasks;
        this._TimeUtils = TimeUtils;
        this._$scope = $scope;
    }  

    targetDateTimeInPast() {
        return this._TimeUtils.dateTimeInPast(this.notification.targetDateTime);
    }

    clearReminderDateTime() {        
        let tgtTask = {};
        tgtTask.id = this.notification.id;
        tgtTask.user = {id: this.notification.user}; // TODO: this seems hacky, but PUT /tasks/update takes id from user object
        tgtTask.reminderDateTime = null;
        tgtTask.reminderDateTimeNotified = false;

        this._$scope.$emit('emitUpdateTaskAndNotification', { tgtTask: tgtTask, notificationType: 'reminder' }); // emit to toast.controller.js
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
