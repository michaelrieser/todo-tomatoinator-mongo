class TaskDueDateTimeInputCtrl {
    constructor() {
        'ngInject';
    }
    
    resetTaskDate() {
        this.task.dueDateTime = null;
    }
}

let TaskDueDateTimeInput =  {
    bindings: {
        task: '='
    },
    controller: TaskDueDateTimeInputCtrl,
    templateUrl: 'components/task-helpers/task-due-date-time-input.html'
};

export default TaskDueDateTimeInput;
