class ProjectsCtrl {
    constructor(Projects, $scope) {
        'ngInject';
        
        this._$scope = $scope;

        this._Projects = Projects;
        this.projects = this._Projects.projects;

        this.resetProject();
        
        this.startIdx = null;
        this.stopIdx = null;
        this.sortableProjectHandlers = {
            start: (event, ui) => {
                console.log('start dragging project')
            },
            stop: (event, ui) => {
                console.log('stop dragging project')
            }
        }                                
    }

    resetProject() {
        this.project = {
            title: '',
        }
    }

    submit() {
        this.isSubmitting = true;
        this._Projects.save(this.project).then(
            (newProject) => {
                this.resetProject();
                this.isSubmitting = false;
                this.projects.push(newProject);
            },
            (err) => {
                this.isSubmitting = false;
                this.errors = err.data.errors;
            }
        )
    }
}

let Projects =  {
    bindings: {},
    controller: ProjectsCtrl,
    templateUrl: 'components/project-helpers/projects.html'
};

export default Projects;
