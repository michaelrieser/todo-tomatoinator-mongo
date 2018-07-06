class AddProjectFormCtrl {
    constructor(Projects, $scope, $timeout) {
        'ngInject';

        this._Projects = Projects;
        this._$scope = $scope;
        this._$timeout = $timeout;        

        this.projects = this._Projects.projects;
        this.highestOrderNumber = this._Projects.highestOrderNumber;                    
        $scope.$watch(() => {return this._Projects.highestOrderNumber}, (newValue) => {
            this.highestOrderNumber = newValue;
        });

        this.resetProject();
    }

    resetProject() {
        this.project = {
            title: '',
            order: null
        }
    }

    clearErrors() {
        // TODO: this is throwing error
        this.errors = null;
    }

    submit() {
        this.isSubmitting = true;
        this.project.order = this.highestOrderNumber + 1;
        this._Projects.save(this.project).then(
            (newProject) => {
                this.highestOrderNumber = newProject.order;
                this.resetProject();
                this.isSubmitting = false;
                this.clearErrors();
                // TODO: flash notification to user?
                // this.projects.push(newProject); // NOTE: now performing this in Projects#addNewProjectToList()
            },
            (err) => {
                this.isSubmitting = false;
                this.errors = err.data.errors;
                this._$timeout(this.clearErrors, 3000); // TODO: this doesn't work!
            }
        )
    }

}

let AddProjectForm = {
    bindings: {},
    controller: AddProjectFormCtrl,
    templateUrl: 'components/project-helpers/add-project-form.html'
};

export default AddProjectForm;
