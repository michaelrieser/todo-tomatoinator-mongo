class DueNotificationCtrl {
    constructor(Tasks, TimeUtils) {
        'ngInject';

        this._Tasks = Tasks;
        this._TimeUtils = TimeUtils;
    }

    targetDateTimeInPast() {
        return this._TimeUtils.dateTimeInPast(this.notification.targetDateTime);
    }

}

let DueNotification = {
    bindings: {
        notification: '='
    },
    controller: DueNotificationCtrl,
    templateUrl: 'components/notification-helpers/due-notification.html'
};

export default DueNotification;
