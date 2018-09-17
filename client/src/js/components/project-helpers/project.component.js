class ProjectCtrl {
    constructor(Projects, ProjectPanel, Tasks, $scope, $state, $stateParams) {
        'ngInject';

        this._Projects = Projects;
        this._ProjectPanel = ProjectPanel;
        this._Tasks = Tasks;
        this._$scope = $scope;
        this._$state = $state;

        // NOTE: attempted to just get name of great-grandparent's ctrl to trigger modal close event, 
        //       BUT "all" project at different level than target projects
        // console.log(this._$scope.$parent.$parent.$parent.$ctrl.constructor.name)
    }

    deleteProject() {
        this._Projects.delete(this.project).then(
            // TODO/REFACTOR(?) => pop target project in Projects service and move handleProjDeleteSuccess() to Projects service as well?
            //  => unsure how to handle first case in handleProjDeleteSuccess() in service, when deleted project is active project?
            (success) => { this.handleProjDeleteSuccess() },
            (err) => console.log(err) 
        )
    }

    handleProjDeleteSuccess(projectTitle) {        
        if (this.project.title === this._Projects.displayProject) {
            this._$state.go("app.tasks.view", {'project': 'all'}, {reload: true}) // TODO: call if currenlty set proj deleted, otherwise we're good :)  
        } else {
            this._Projects.refreshProjects();
            this._Tasks.refreshTasks();
        }
    }

    isDisplayProject() {
        return this._Projects.displayProject === this.project.title;
    }

    closeProjPanelIfOpen() {
        this._ProjectPanel.closeProjectPanel();
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
