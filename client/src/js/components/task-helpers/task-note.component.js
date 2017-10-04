class TaskNoteCtrl {
    constructor(Tasks, $scope) {
        'ngInject';
        // this._Tasks = Tasks; 
    }
}

let Task =  {
    bindings: {
        task: '=',
        note: '='        
    },
    controller: TaskNoteCtrl,
    templateUrl: 'components/task-helpers/task-note.html'
};

export default Task;
