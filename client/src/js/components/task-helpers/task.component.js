class TaskCtrl {
    constructor(Tasks, $scope) {
        'ngInject';

        // this._Tasks = Tasks; 
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
