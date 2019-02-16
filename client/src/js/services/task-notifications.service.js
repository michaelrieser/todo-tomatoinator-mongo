export default class TaskNotifications {
  constructor(AppConstants, Tasks, $http, $interval, $mdToast) {
    'ngInject';

    this._AppConstants = AppConstants;
    this._Tasks        = Tasks;
    this._$http        = $http;
    this._$interval    = $interval;
    this._$mdToast     = $mdToast;
  }

  clearIntervalAndCloseToast() {
    this.clearInterval();
    this.closeToast();
  }

  clearInterval() {
    this._$interval.cancel(this.timerInterval);
  }

  closeToast() {
    this._$mdToast.hide();
  }

  initializeInterval() {
    this.queryAndDisplayToastIfNotifications();

    if (this.timerInterval) { return; } // guard cond - don't want to set another interval if pre existing  
    this.timerInterval = this._$interval(() => {      
      this.queryAndDisplayToastIfNotifications();
    }, 60000); 
  }

  queryAndDisplayToastIfNotifications(queryConfig = {}) {
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
    this.displayToastIfNotifications(this.notifications);
    
    return refreshedTaskNotificationInfo;
  }

  updateTaskAndResolveNotification(tgtTask, notificationType) {
    let tgtNotificationId = tgtTask.id;
    return this._Tasks.updateAndSet(tgtTask).then(
      (updatedTask) => this.removeResolvedNotification(tgtNotificationId, notificationType),
      (err) => console.log(err)
    )   
  }

  removeResolvedNotification(tgtNotificationId, notificationType) { 
    let targetNotifications = notificationType === 'due' ? 
             this.notifications.dueDateTimeNotifications : 
             this.notifications.reminderDateTimeNotifications;
    let tgtNotificationIdx = targetNotifications.findIndex( (n) => { return n.id === tgtNotificationId } );
    if (tgtNotificationIdx !== -1) { targetNotifications.splice(tgtNotificationIdx, 1); }
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
      tgtTask.reminderIntervalNumber = notification.reminderIntervalNumber;
      tgtTask.reminderIntervalPeriod = notification.reminderIntervalPeriod;
    }

    return tgtTask;
  }

  sleepDueNotification(tgtNotification, sleepDuration) {
    let tgtTask = this.getTaskFromNotification(tgtNotification);
      // NOTE: this would add sleepDuration to current targetDateTime, but that could be a month in the past
    // tgtTask.dueDateTime = moment(tgtTask.dueDateTime).add(sleepDuration).toISOString();
    tgtTask.dueDateTime = moment().add(sleepDuration).toISOString();
    this.updateTaskAndResolveNotification(tgtTask, 'due')
  }

  sleepReminderNotification(tgtNotification) {
    let tgtTask = this.getTaskFromNotification(tgtNotification);
    let priorTgtDateTime = moment(tgtNotification.targetDateTime);
    let reminderIntervalNumber = tgtNotification.reminderIntervalNumber;
    let reminderIntervalPeriod = tgtNotification.reminderIntervalPeriod;

    let tgtHour = priorTgtDateTime.get('hour');
    let tgtMinute = priorTgtDateTime.get('minute');
    let tgtSecond = priorTgtDateTime.get('second');

    let currentWeekday = moment().isoWeekday();
    let currentHour    = moment().get('hour');
    let currentMinute = moment().get('minute');               

    // NOTE: will set newReminderDateTime to isoWeekday/hour/minute/second from priorTgtDateTime, 
    //       then bump to next week/day/hour/minute if in the past with the following granularity:
    //       * 'week' || 'day' => hourly
    //       * 'hour'          => minute
    let newReminderDateTime = moment();
    // TODO: extract setting of newReminderDateTime h/m/s (in each conditional branch below) into method here-ish?
    if (reminderIntervalPeriod.includes('week')) {
      let tgtWeekday     = priorTgtDateTime.isoWeekday();      
      
      newReminderDateTime.isoWeekday(tgtWeekday);
      newReminderDateTime.set('hour', tgtHour);
      newReminderDateTime.set('minute', tgtMinute);
      newReminderDateTime.set('second', tgtSecond);   

      if (tgtWeekday < currentWeekday) { 
        newReminderDateTime.add(reminderIntervalNumber, reminderIntervalPeriod);
      } else if (tgtWeekday === currentWeekday && tgtHour <= currentHour) {
        newReminderDateTime.add(reminderIntervalNumber, reminderIntervalPeriod);
      }
    } else if (reminderIntervalPeriod.includes('day')) {      
      newReminderDateTime.set('hour', tgtHour);
      newReminderDateTime.set('minute', tgtMinute);
      newReminderDateTime.set('second', tgtSecond);

      if (tgtHour < currentHour) {
        newReminderDateTime.add(reminderIntervalNumber, reminderIntervalPeriod);
      } else if (tgtHour === currentHour && tgtMinute <= currentMinute) {
        newReminderDateTime.add(reminderIntervalNumber, reminderIntervalPeriod);
      }
    } else if (reminderIntervalPeriod.includes('hour')) {      
      newReminderDateTime.set('minute', tgtMinute);
      newReminderDateTime.set('second', tgtSecond);

      if (tgtMinute <= currentMinute) {
        newReminderDateTime.add(reminderIntervalNumber, reminderIntervalPeriod);
      } 
    } else {
      // TODO: throw error?
    }

    tgtTask.reminderDateTime = newReminderDateTime.toISOString();
    this.updateTaskAndResolveNotification(tgtTask, 'reminder');
  }

  displayToastIfNotifications(newNotifications) {
        if (!newNotifications) { return; } 
        let notificationsLength = newNotifications.dueDateTimeNotifications.length +
            newNotifications.reminderDateTimeNotifications.length;
        if (notificationsLength > 0) {                     
            this.displayToast(newNotifications);                 
        } else { 
          this._$mdToast.hide(); 
        }    
  }

  displayToast(newNotifications) {
        // this.toastDisplayed = true; // NOTE: kept for reference
        // SEE: https://material.angularjs.org/latest/demo/toast & https://material.angularjs.org/latest/api/service/$mdToast
        this._$mdToast.show({
            hideDelay: false,
            // animation: 'fade',
            // position: 'bottom left', // TODO: appears to be overriding this and going to bottom, this is OK but probably worth investigating
            controller: 'ToastCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'toast/toast.html',
            locals: {
                notifications: newNotifications,
                // toastDisplayed: this.toastDisplayed
            },
            bindToController: true
        }).then( (resolvedPromise) => { /* this.toastDisplayed = false; */ } ); // NOTE: kept for reference
  }
}
