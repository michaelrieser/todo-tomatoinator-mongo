class ToastCtrl {
  // TODO: create PomService to make backend calls for updating time spent on tasks? -OR- just put in tasks.service.js
  constructor($scope, $mdToast, $mdDialog, Tasks) {
    'ngInject';

    this._$scope = $scope;
    this._$mdToast = $mdToast;
    this._$mdDialog = $mdDialog;
    this._Tasks = Tasks;

    this.isDlgOpen = false;    

    // TODO: just have one array of notifications and sort by dueDate/reminder => set String on backend to designate w/i each obj(?)
    this.dueDateTimeNotifications = this.notifications.dueDateTimeNotifications;
    this.reminderDateTimeNotifications = this.notifications.reminderDateTimeNotifications;

  }
}

export default ToastCtrl;
