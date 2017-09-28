class TaskNotesCtrl {
    constructor(Tasks, $scope) {
        'ngInject';

        // this._Tasks = Tasks; 
    }
}

let Task =  {
    bindings: {
        taskNotes: '='
    },
    controller: TaskNotesCtrl,
    templateUrl: 'components/task-helpers/task-notes.html'
};

export default Task;
