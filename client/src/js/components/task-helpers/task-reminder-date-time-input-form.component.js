class TaskReminderDateTimeInputFormCtrl {
    constructor($scope, Tasks, TaskNotifications) {
        'ngInject';

        this._$scope = $scope;
        this._Tasks = Tasks;
        this._TaskNotifications = TaskNotifications;

        this.reminderIntervalOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        this.reminderPeriodOptions = ['hour', 'day', 'week', 'month'];        
    }

    // Assuming that since user is updating reminder at task level, they are already aware if a notification is present,
    //   thus, we can safely just resolve the notification
    updateReminder() {
        this._TaskNotifications.updateTaskAndResolveNotification(this.task, 'reminder').then(
            (updatedTask) => this.displayingreminderdatetimeinput = false,
            (err) => console.log(err)            
        )
    }

    clearReminder() {
        this.clearTaskReminderFields();
        console.log(this.task);
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

    handleReminderIntervalChange() {
        let intervalNumber = this.task.reminderIntervalNumber;
        let intervalPeriod = this.task.reminderIntervalPeriod;

        if (intervalNumber && intervalPeriod) {
            this.task.reminderDateTime = moment().add(intervalNumber, intervalPeriod).toISOString();
        }
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
