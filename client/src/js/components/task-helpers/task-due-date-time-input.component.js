class TaskDueDateTimeInputCtrl {
    constructor($scope, Tasks) {
        'ngInject';

        this._$scope = $scope;
        this._Tasks = Tasks;
    }
    
    removeTaskDate() {
        this.task.dueDateTime = null;      
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
