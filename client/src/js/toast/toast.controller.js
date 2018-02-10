class ToastCtrl {
  // TODO: create PomService to make backend calls for updating time spent on tasks? -OR- just put in tasks.service.js
  constructor($scope, $mdToast, $mdDialog, Tasks) {
    'ngInject';

    this._$scope = $scope;
    this._$mdToast = $mdToast;
    this._$mdDialog = $mdDialog;
    this._Tasks = Tasks;

    this.isDlgOpen = false;

    this.dueDateTimeNotifications = this.notifications.dueDateTimeNotifications;
    this.reminderDateTimeNotifications = this.notifications.reminderDateTimeNotifications;

    this._$scope.$on('emitUpdateTaskAndNotification', (evt, data) => this.updateTaskAndNotification(data));
  }

  updateTaskAndNotification(data) {
    let tgtTask = data.tgtTask;
    let tgtNotificationId = data.tgtTask.id; 
    console.log(`tgtNotificationId: ${tgtNotificationId}`);
    this._Tasks.updateAndSet(tgtTask).then(
      (updatedTask) => this.removeResolvedNotification(tgtNotificationId, data.notificationType),
      (err) => console.log(err)
    )    
  }
  removeResolvedNotification(tgtNotificationId, notificationType) { // notificationType === 'due' || 'reminder'
    let targetNotifications = notificationType === 'due' ? this.dueDateTimeNotifications : this.reminderDateTimeNotifications;
    let tgtNotificationIdx = targetNotifications.findIndex( (n) => { return n.id === tgtNotificationId } );
    console.log(`tgtNotificationIdx: ${tgtNotificationIdx}`);
    targetNotifications.splice(tgtNotificationIdx, 1);
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
