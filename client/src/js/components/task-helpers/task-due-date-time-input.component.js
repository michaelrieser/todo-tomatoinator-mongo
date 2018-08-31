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
        
        if (this.editmode) {
            this._Tasks.update(this.task).then(
                (updatedTask) => {return updatedTask},
                (err) => console.log(err)
            )
        }  
    }

}

let TaskDueDateTimeInput =  {
    bindings: {
        displayingduedatetimeinput: '=',
        task: '=',
    },
    controller: TaskDueDateTimeInputCtrl,
    templateUrl: 'components/task-helpers/task-due-date-time-input.html'
};

export default TaskDueDateTimeInput;
