class TasksCtrl {
    constructor(projectsInfo, $scope, $stateParams) {
        'ngInject';
            
        this.projects = projectsInfo.projects;
    }
}

export default TasksCtrl;
