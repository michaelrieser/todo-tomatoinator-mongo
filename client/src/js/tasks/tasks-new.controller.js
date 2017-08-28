class TasksNewCtrl {
    constructor(Tasks, $state) {
        'ngInject';

        this._Tasks = Tasks;
        this._$state = $state; 

        this.task = {
            title: '',
            order: null,
            priority: null,
            timesPaused: 0,
            isActive: false,
            isComplete: false,
            wasSuccessful: null,
            tagList: []
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

    submit() {
        this.isSubmitting = true;
        this._Tasks.save(this.task).then(
            (newTask) => {
                this._$state.go('app.tasks');
            },
            (err) => {
                this.isSubmitting = false;
                this.errors = err.data.errors;
            }
        )
    }
}

export default TasksNewCtrl;
