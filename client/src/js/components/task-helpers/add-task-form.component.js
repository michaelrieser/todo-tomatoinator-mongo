class AddTaskFormCtrl {
    constructor(Tasks, Projects, $state, $scope) {
        'ngInject';

        this._Tasks = Tasks;
        this._Projects = Projects;
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
            order: null, // Question/TODO: set to this.highestOrderNumber + 1 ?
            project: this.getDefaultProject(), // NOTE: default to 'miscellaneous' if 'all' projects currently displayed
            priority: null,
            timesPaused: 0,
            isActive: false,
            isComplete: false,
            wasSuccessful: null,
            tagList: []
        }
    }

    getDefaultProject() {
        var tgtProjectTitle = this.displayproject === 'all' ? 'miscellaneous' : this.displayproject;
        // find project in projects array and return - must set selected option to Object in ng-repeat list
        return this._Projects.projects.find( (p) => { return p.title === tgtProjectTitle }); 
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
    bindings: {
        tasksinfo: '=', // NOTE: Camel Cased binding keys are converted to kebab case. USE LOWERCASE
        displayproject: '='
    },
    controller: AddTaskFormCtrl,
    templateUrl: 'components/task-helpers/add-task-form.html'
};

export default AddTaskForm;
