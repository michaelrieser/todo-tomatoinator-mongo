class ProjectCtrl {
    constructor(Projects, Tasks, $scope, $state, $stateParams) {
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

    handleProjDeleteSuccess(projectTitle) {
        console.log(this._Projects.displayProject);
        
        if (this.project.title === this._Projects.displayProject) {
            this._$state.go("app.tasks.view", {'project': 'all'}, {reload: true}) // TODO: call if currenlty set proj deleted, otherwise we're good :)  
        } else {
            this._Projects.refreshProjects();
            this._Tasks.refreshTasks();
        }
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
