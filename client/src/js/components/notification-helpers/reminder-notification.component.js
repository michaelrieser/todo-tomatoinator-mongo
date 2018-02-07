class ReminderNotificationCtrl {
    constructor(Tasks, TimeUtils) {
        'ngInject';

        this._Tasks = Tasks;
        this._TimeUtils = TimeUtils;
    }  

    targetDateTimeInPast() {
        return this._TimeUtils.dateTimeInPast(this.notification.targetDateTime);
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
