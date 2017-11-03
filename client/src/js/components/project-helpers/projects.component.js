class ProjectsCtrl {
    constructor(Projects, $scope) {
        'ngInject';

        this._Projects = Projects;
        this._$scope = $scope;

        this.resetProject();
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
                this.projects.push(newProject); // Question: just add to end as projects will be sorted asc by date in backend?
            },
            (err) => {
                this.isSubmitting = false;
                this.errors = err.data.errors;
            }
        )
    }
}

let Projects =  {
    bindings: {
        projects: '=',
    },
    controller: ProjectsCtrl,
    templateUrl: 'components/project-helpers/projects.html'
};

export default Projects;
