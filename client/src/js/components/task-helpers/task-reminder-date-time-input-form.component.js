class TaskReminderDateTimeInputFormCtrl {
    constructor($scope, Tasks, TaskNotifications) {
        'ngInject';

        this._$scope = $scope;
        this._Tasks = Tasks;
        this._TaskNotifications = TaskNotifications;

        this.reminderIntervalOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        this.reminderPeriodOptions = ['hour', 'day', 'week', 'month'];
        
        // temporary reminder fields (task not updated until Save/Clear/Cancel triggered from ui)
        this.reminderIntervalNumber   = this.task.reminderIntervalNumber;
        this.reminderIntervalPeriod   = this.task.reminderIntervalPeriod;
        this.reminderDateTime         = this.task.reminderDateTime;

        this.handleReminderIntervalChange(true);
    }

    // Assuming that since user is updating reminder at task level, they are already aware if a notification is present,
    //   thus, we can safely just resolve the notification
    updateReminder() {
        this.updateTaskReminderFields();

        this._TaskNotifications.updateTaskAndResolveNotification(this.task, 'reminder').then(
            (updatedTask) => this.displayingreminderdatetimeinput = false,
            (err) => console.log(err)            
        )
    }
    updateTaskReminderFields() {
        this.task.reminderIntervalNumber = this.reminderIntervalNumber;
        this.task.reminderIntervalPeriod = this.reminderIntervalPeriod;
        this.task.reminderDateTime       = this.reminderDateTime;
    }

    clearReminder() {
        this.clearTaskReminderFields();
        this._TaskNotifications.updateTaskAndResolveNotification(this.task, 'reminder').then(
            (updatedTask) => this.displayingreminderdatetimeinput = false,
            (err) => console.log(err)            
        )
    }

    clearTaskReminderFields() {
        this.task.reminderDateTime = null;
        this.task.reminderDateTimeNotified = false;
        this.task.reminderIntervalNumber = null;
        this.task.reminderIntervalPeriod = null;
    }    

    cancelReminderUpdate() {
        this.displayingreminderdatetimeinput = false;
        // NOTE: this will persist data in fields
    }
    
    removeTaskDate() {
        this.task.reminderDateTime = null;      
        if (this.editmode) {
            this._Tasks.update(this.task).then(
                (updatedTask) => {return updatedTask},
                (err) => console.log(err)
            )
        }  
    }

    handleReminderIntervalChange(calledOnLoad=false) {        
        let intervalPeriodIndex = this.reminderPeriodOptions.indexOf(this.reminderIntervalPeriod);
        
        if (this.reminderIntervalNumber > 1) {
            this.reminderPeriodOptions = ['hours', 'days', 'weeks', 'months'];
        } else {
            this.reminderPeriodOptions = ['hour', 'day', 'week', 'month'];
        }
        // set reminderIntervalPeriod to value selected before change - due to switching reminderPeriodOptions b/tw pluralized and non-pluralized Arrays
        if (intervalPeriodIndex > -1) {
            this.reminderIntervalPeriod = this.reminderPeriodOptions[intervalPeriodIndex]; 
        }

        if (this.reminderIntervalNumber && this.reminderIntervalPeriod && !calledOnLoad) { // all values set and change made (i.e. not on component instantiation)
            this.reminderDateTime = this.getSuggestedTgtReminderDateTime().toISOString();
        }
    }   
    getSuggestedTgtReminderDateTime() {
        let tgtReminderDateTime = moment().add(this.reminderIntervalNumber,this.reminderIntervalPeriod)
        // round up to nearest hour - SEE: https://stackoverflow.com/questions/17691202/round-up-round-down-a-momentjs-moment-to-nearest-minute
        !this.reminderIntervalPeriod.includes('hour') && ( tgtReminderDateTime.minute() || tgtReminderDateTime.second() || tgtReminderDateTime.millisecond() ) 
            ? tgtReminderDateTime.add(1, 'hour').startOf('hour') // add 1 hour if 'monthly' || weekly' || 'daily' ('hourly' already adds)
            : tgtReminderDateTime.startOf('hour');
        return tgtReminderDateTime;
    } 
}

let TaskReminderDateTimeInputForm =  {
    bindings: {
        task: '=',
        displayingreminderdatetimeinput: '='
    },
    controller: TaskReminderDateTimeInputFormCtrl,
    templateUrl: 'components/task-helpers/task-reminder-date-time-input-form.html'
};

export default TaskReminderDateTimeInputForm;
