class TaskCtrl {
    constructor(Tasks, $scope) {
        'ngInject';

        this._Tasks = Tasks;         
        console.log(this.task.showNotes);
        console.log(this.task.title);
        /* Question - not sure if this is necessary, can we just use two-way binding with fields Ex: this.task etc.. */        
        // this.formData = {
        //     id: this.task.id,
        //     title: this.task.title,
        //     order: this.task.order,
        //     priority: this.task.priority,
        //     timesPaused: this.task.timesPaused,
        //     isActive: this.task.isActive,
        //     isComplete: this.task.isComplete,
        //     wasSuccessful: this.task.wasSuccessful,
        //     createdAt: this.task.createdAt,
        //     updatedAt: this.task.updatedAt,
        //     tagList: this.task.tagList,
        //     showNotes: this.task.showNotes,
        //     // notes: this.task.notes,
        //     user: this.task.user
        // }
    }

    toggleTaskNotes() {                                
        this.task.showNotes = !this.task.showNotes;
        this._Tasks.toggleTaskNotes(this.task);                
    }

    deleteTask() {
        console.log('deleteTask()');
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
