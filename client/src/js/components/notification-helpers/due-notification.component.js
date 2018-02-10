class DueNotificationCtrl {
    constructor(Tasks, TimeUtils, $scope) {
        'ngInject';

        this._Tasks = Tasks;
        this._TimeUtils = TimeUtils;
        this._$scope = $scope;
    }

    targetDateTimeInPast() {
        return this._TimeUtils.dateTimeInPast(this.notification.targetDateTime);
    }

    clearDueDateTime() {
        let tgtTask = {};
        tgtTask.id = this.notification.id;
        tgtTask.user = {id: this.notification.user}; // TODO: this seems hacky, but PUT /tasks/update takes id from user object
        tgtTask.dueDateTime = null;
        tgtTask.dueDateTimeNotified = false;

        this._$scope.$emit('emitUpdateTaskAndNotification', { tgtTask: tgtTask, notificationType: 'due' }); // emit to toast.controller.js
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
