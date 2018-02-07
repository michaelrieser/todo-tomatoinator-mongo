export default class TaskNotifications {
  constructor(AppConstants, $http, $interval) {
    'ngInject';

    this._AppConstants = AppConstants;
    this._$http = $http;
    this._$interval = $interval;            

    this.initializeInterval();
  }

  initializeInterval() {
    this.timerInterval = this._$interval(() => {      
      console.log('Notifications queried')
      this.query();
    }, 15000);
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

  // reminderColorFromTimeRemaining(reminder) {
  //   return this.colorFromTimeRemaining(reminder.reminderDateTime);    
  // }
  // dueDateColorFromTimeRemaining(dueDate) {
  //   return this.colorFromTimeRemaining(dueDate.dueDateTime);
  // }

  // isReminderPastDue(reminder) {
  //   return moment(reminder.reminderDateTime).isBefore(moment())
  // }
  // isDueDatePastDue(dueDate) {
  //   return moment(dueDate.dueDateTime).isBefore(moment());
  // }
}
