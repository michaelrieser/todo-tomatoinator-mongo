class AddTaskFormCtrl {
    constructor(Tasks, $state, $scope) {
        'ngInject';

        this._Tasks = Tasks;
        this._$state = $state; 
        this._$scope = $scope;

        this.highestOrderNumber = this.tasksinfo.highestOrderNumber;
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
        this.task.order = this.highestOrderNumber + 1; 
        // Note: user is set in backend via passed JWT
        this._Tasks.save(this.task).then(
            (newTask) => {
                this.resetTask();
                this.isSubmitting = false;
                this._$scope.$emit('updateTasks');
                // TODO: Flash notification to user
                // this._$state.go('app.tasks.all');              
                this.highestOrderNumber = newTask.order;
            },
            (err) => {
                this.isSubmitting = false;
                this.errors = err.data.errors;
            }
        )        
    }    
}

let AddTaskForm = {
    bindings: {
        tasksinfo: '=', // NOTE: Camel Cased binding keys are converted to kebab case. USE LOWERCASE
    },
    controller: AddTaskFormCtrl,
    templateUrl: 'components/task-helpers/add-task-form.html'
};

export default AddTaskForm;
