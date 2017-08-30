class TasksNewCtrl {
    constructor(tasksInfo, Tasks, $state) {
        'ngInject';

        this._Tasks = Tasks;
        this._$state = $state; 
        this._highestOrderNumber = tasksInfo.highestOrderNumber;        
        this.resetTask();
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
            order: null,
            priority: null,
            timesPaused: 0,
            isActive: false,
            isComplete: false,
            wasSuccessful: null,
            tagList: []
        }
    }

    submit() {
        this.isSubmitting = true;
        this.task.order = this._highestOrderNumber + 1; 
        // Note: user is set in backend via passed JWT
        this._Tasks.save(this.task).then(
            (newTask) => {
                this.resetTask();
                this._$state.go('app.tasks.all');                
            },
            (err) => {
                this.isSubmitting = false;
                this.errors = err.data.errors;
            }
        )        
    }
}

export default TasksNewCtrl;
