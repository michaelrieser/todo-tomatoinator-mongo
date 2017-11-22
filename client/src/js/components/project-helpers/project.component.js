class ProjectCtrl {
    constructor(Projects, $scope, $state) {
        'ngInject';

        this._Projects = Projects;
        this._$scope = $scope;
        this._$state = $state;
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
