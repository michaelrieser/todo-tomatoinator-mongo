class TasksCtrl {
    constructor(projects, $scope) {
        'ngInject';

        this._$scope = $scope;

        this.projects = projects;
    }    
}

export default TasksCtrl;
