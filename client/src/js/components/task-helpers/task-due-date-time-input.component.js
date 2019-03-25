class TaskDueDateTimeInputCtrl {
    constructor($scope, $interval, Tasks) {
        'ngInject';

        this._$scope = $scope;
        this._Tasks = Tasks;
        this._$interval = $interval;
    }
    
    removeTaskDate() {
        // setting this w/o $interval wasn't reflecting changes in view - probably due to jQuery datetimepicker not updating view
        //  SEE: https://stackoverflow.com/questions/18626039/apply-already-in-progress-error (comment by Onur Yildrium)
        this._$interval( () => { this.task.dueDateTime = null; }); 
        
        if (this.editmode) { // TODO: this could probably be deleted, since we don't need to update/remove due-date-time on new task
            this._Tasks.update(this.task).then(
                (updatedTask) => {return updatedTask},
                (err) => console.log(err)
            )
        }  
    }

}

let TaskDueDateTimeInput =  {
    bindings: {
        displayingduedatetimeinput: '=', // TODO: convert attribute to kebab-case in view to allow for camelCase here
        task: '=',
    },
    controller: TaskDueDateTimeInputCtrl,
    templateUrl: 'components/task-helpers/task-due-date-time-input.html'
};

export default TaskDueDateTimeInput;
