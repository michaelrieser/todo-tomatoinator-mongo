class ProjectCtrl {
    constructor(Projects, Tasks, $scope, $state) {
        'ngInject';

        this._Projects = Projects;
        this._Tasks = Tasks;
        this._$scope = $scope;
        this._$state = $state;
    }

    deleteProject() {
        this._Projects.delete(this.project).then(
            (success) => { this.handleProjDeleteSuccess() },
            (err) => console.log(err) 
        )
    }

    handleProjDeleteSuccess() {
        // TODO: remove project from parent tasks.controller.js
        this._Tasks.refreshTasks();
    }
}

let Project =  {
    bindings: {
        project: '=',
    },
    controller: ProjectCtrl,
    templateUrl: 'components/project-helpers/project.html'
};

export default Project;
