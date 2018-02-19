export default class TaskNotifications {
  constructor(AppConstants, Tasks, $http, $interval) {
    'ngInject';

    this._AppConstants = AppConstants;
    this._Tasks = Tasks;
    this._$http = $http;
    this._$interval = $interval;            

    this.initializeInterval();
  }

  initializeInterval() {
    this.timerInterval = this._$interval(() => {      
      console.log('Notifications queried')
      this.query();
    }, 60000);    
  }

  query(queryConfig = {}) {
    let request = {
      url: `${this._AppConstants.api}/tasks/notifications`,
      method: 'GET',
      // params: queryConfig.filters ? queryConfig.filters : null
      // TODO: eventually add functionality (here + update route) for user to specify date range
    }
    return this._$http(request).then((res) => this.handleQueryResponse(res.data) );
  }
  handleQueryResponse(refreshedTaskNotificationInfo) {
    if (!this.notifications) { this.notifications = {}; };
    // NOTE: angular.copy(<src>, <dest>) clears <dest> object and replaces its contents with <src> => thus alleviating need to set $watch on ctrl
    angular.copy(refreshedTaskNotificationInfo.notifications, this.notifications);
    return refreshedTaskNotificationInfo;
  }

  updateTaskAndNotification(tgtTask, notificationType) {
    let tgtNotificationId = tgtTask.id;
    return this._Tasks.updateAndSet(tgtTask).then(
      (updatedTask) => this.removeResolvedNotification(tgtNotificationId, 'due'),
      (err) => console.log(err)
    )   
  }

  removeResolvedNotification(tgtNotificationId, notificationType) { 
    let targetNotifications = notificationType === 'due' ? 
             this.notifications.dueDateTimeNotifications : 
             this.notifications.reminderDateTimeNotifications;
    let tgtNotificationIdx = targetNotifications.findIndex( (n) => { return n.id === tgtNotificationId } );
    targetNotifications.splice(tgtNotificationIdx, 1);
    return true;
  }

  getTaskFromNotification(notification) {
    let tgtTask = {};
    tgtTask.id = notification.id;
    tgtTask.user = {id: notification.user}; // TODO: this seems hacky, but PUT /tasks/update takes id from user object
    
    if (notification.type === 'due') {
      tgtTask.dueDateTime = notification.targetDateTime;
    } else {
      tgtTask.reminderDateTime = notification.targetDateTime;
    }

    return tgtTask;
  }
}
