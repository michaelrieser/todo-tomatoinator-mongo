class AddTaskFormCtrl {
    constructor(Tasks, Projects, $state, $scope) {
        'ngInject';

        this._Tasks = Tasks;
        this._Projects = Projects;
        this._$state = $state; 
        this._$scope = $scope;

        this.displayingduedatetimeinput = false;
        this.displayingreminderdatetimeinput = false;

        this.priorityOptions = [{value: 1, label: 'A'},
                                {value: 2, label: 'B'},
                                {value: 3, label: 'C'},
                                {value: 4, label: 'D'}];

        this.highestOrderNumber = this._Tasks.highestOrderNumber;    
        $scope.$watch(() => {return this._Tasks.highestOrderNumber}, (newValue) => {
            this.highestOrderNumber = newValue;
        })
        this.resetTask();
    }

    toggleDueDateTimeDisplay() {
        this.displayingduedatetimeinput = !this.displayingduedatetimeinput;
        if (!this.displayingduedatetimeinput) {
            this.task.dueDateTime = null;
        }
    }

    toggleReminderDateTimeDisplay() {
        this.displayingreminderdatetimeinput = !this.displayingreminderdatetimeinput;
        if (!this.displayingreminderdatetimeinput) { // clear reminderDateTime fields on close
            this.task.reminderIntervalNumber = null;
            this.task.reminderIntervalPeriod = null;
            this.task.reminderDateTime = null;
        }
    }

    addTag() {
        // Make sure this tag isn't already in the array
        if (!this.task.tagList.includes(this.tagField)) {
            this.task.tagList.push(this.tagField);
            this.tagField = '';
        }
    }

    removeTag(tagName) {
        this.task.tagList = this.task.tagList.filter( (slug) => slug != tagName);
    }

    resetTask() {
        this.task = {
            title: '',
            order: null, // Question/TODO: set to this.highestOrderNumber + 1 ?
            project: this._Projects.getDefaultProject(), // NOTE: default to 'miscellaneous' if 'all' projects currently displayed
            priority: this.priorityOptions[0].value,
            timesPaused: 0,
            isActive: false,
            isComplete: false,
            wasSuccessful: null,
            dueDateTime: null, // TODO: combine date objects and send to backend
            reminderIntervalNumber: null,
            reminderIntervalPeriod: null,
            reminderDateTime: null,
            tagList: []
        }
    }

    submit() {
        this.isSubmitting = true;
        this.task.order = this.highestOrderNumber + 1; 
        // Note: user is set in backend via passed JWT
        this._Tasks.save(this.task).then(
            (newTask) => {
                this.highestOrderNumber = newTask.order;
                this.resetTask();
                this.isSubmitting = false;
                this._Tasks.refreshTasks();
                
                // TODO: Flash notification to user
                // this._$state.go('app.tasks.all');              
            },
            (err) => {
                this.isSubmitting = false;
                this.errors = err.data.errors;
            }
        )        
    }    
}

let AddTaskForm = {
    bindings: {},
    controller: AddTaskFormCtrl,
    templateUrl: 'components/task-helpers/add-task-form.html'
};

export default AddTaskForm;
