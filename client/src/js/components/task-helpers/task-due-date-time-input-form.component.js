class TaskDueDateTimeInputFormCtrl {
    constructor($scope, Tasks) {
        'ngInject';

        this._$scope = $scope;
        this._Tasks = Tasks;

    }
    
    removeTaskDate() {
        this.task.dueDateTime = null;      
        this._Tasks.update(this.task).then(
            (updatedTask) => { return updatedTask },
            (err) => console.log(err)
        )
    }

    handleDueDateTimeInputBlur() {
        if (this.task.dueDateTime === undefined) { this.task.dueDateTime = null; }
        // QUESTION / TODO: set bound displayingduedatetimeinput here first (to close input) || Add spinner ?
        this._Tasks.update(this.task).then(
            (updatedTask) => {
                this.displayingduedatetimeinput = false;
                return updatedTask;
            },
            (err) => console.log(err)
        )
    }
}

let TaskDueDateTimeInputForm =  {
    bindings: {
        displayingduedatetimeinput: '=',
        task: '=',
    },
    controller: TaskDueDateTimeInputFormCtrl,
    templateUrl: 'components/task-helpers/task-due-date-time-input-form.html'
};

export default TaskDueDateTimeInputForm;
