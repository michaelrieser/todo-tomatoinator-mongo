class TaskCtrl {
    constructor(Tasks, PomTimer, Projects, $scope, $state) {
        'ngInject';

        this._Tasks = Tasks;   
        this._PomTimer = PomTimer;
        this._Projects = Projects;
        this._$state = $state;              
        this._$scope = $scope;

        this.editingTitle = false;
        this.editingDueDateTime = false;
        this.updatingTask = false;        

        $scope.$on('updateTaskOnCalendarBlur', (evt, data) => this.handleEditDueDateTimeToggle());
    }

    handleEditTitleToggle() {        
        this.editingTitle = !this.editingTitle;
        if (!this.editingTitle) { // Done making edits
            this.updateTask();
        }
    }

    handleEditDueDateTimeToggle() {
        this.editingDueDateTime = !this.editingDueDateTime;
        if (!this.editingDueDateTime) { // Done making edits 
            this.updateTask();    
        }
    }

    updateTask() {
        this._Tasks.update(this.task).then(
            (updatedTask) => {return updatedTask},
            (err) => console.log(err)
        )
    }

    toggleTaskNotes() {
        this.task.showNotes = !this.task.showNotes;
        this._Tasks.update(this.task);                
    }

    deleteTask() {
        // this.isDeleting = true; // TODO: send this to parent ctrl as component will be deleted? -see article-actions.component
        this._Tasks.delete(this.task).then(
            (success) => { this.handleTaskDeleteSuccess(); },
            (err) => console.log(err)
        )
    }
    handleTaskDeleteSuccess() {
        this._PomTimer.resetTimer();
        this._Tasks.refreshTasks()
    }

    toggleTaskComplete() {
        this.task.isComplete = !this.task.isComplete;
        if (this.task.isActive) { 
            this._PomTimer.resetTimer();
            this.task.isActive = false; 
        };
        this._Tasks.update(this.task).then(
            (success) => this._Tasks.refreshTasks(), 
            (err) => console.log(err)
        )
    }

    toggleTaskActive() {
        this._PomTimer.resetTimer(); // Added here if connection is slow and new PomTimer component isn't instantiated right away (and resetTimer() is called in PomTimer ctor)
        this._Tasks.toggleTaskActive(this.task);
    }
}

let Task =  {
    bindings: {
        task: '='
    },
    controller: TaskCtrl,
    templateUrl: 'components/task-helpers/task.html'
};

export default Task;
