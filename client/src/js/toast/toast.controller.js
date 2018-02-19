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

  closeToast() {
    if (this.isDlgOpen) return;

    this._$mdToast
      .hide()
      .then(() => { this.isDlgOpen = false; });
  }

  // TODO: remove this, DIALOG NOT CURRENTLY USED
  openMoreInfo(e) {
    if (this.isDlgOpen) return;
    this.isDlgOpen = true;

    this._$mdDialog
      .show(this._$mdDialog
        .alert()
        .title('More info goes here.')
        .textContent('Something witty.')
        .ariaLabel('More info')
        .ok('Got it')
        .targetEvent(e)
      )
      .then(() => { this.isDlgOpen = false; });
  };
}

export default ToastCtrl;
