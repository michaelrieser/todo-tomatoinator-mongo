class ToastCtrl {
  // TODO: create PomService to make backend calls for updating time spent on tasks? -OR- just put in tasks.service.js
  constructor($scope, $mdToast, $mdDialog, Tasks, TaskNotifications) {
    'ngInject';

    this._$scope = $scope;
    this._$mdToast = $mdToast;
    this._$mdDialog = $mdDialog;
    this._TaskNotifications = TaskNotifications;

    this.isDlgOpen = false;    

    // TODO: just have one array of notifications and sort by dueDate/reminder => set String on backend to designate w/i each obj(?)
    this.dueDateTimeNotifications = this.notifications.dueDateTimeNotifications;
    this.reminderDateTimeNotifications = this.notifications.reminderDateTimeNotifications;

    // REFACTOR(?) => could have check in each due/reminder-notification method, but that would be A LOT!
    this._$scope.$watch(
      () => { return this._TaskNotifications.notifications },
      (newNotifications) => {        
        let notificationsLength = newNotifications.dueDateTimeNotifications.length +
            newNotifications.reminderDateTimeNotifications.length;
        if (notificationsLength === 0) { this._$mdToast.hide(); }
      },
      true // deep watch => couldn't use $watchCollection as that only checks obj equality one level deep
    )
  }
}

export default ToastCtrl;
