class ProjectListCtrl {
    constructor(Projects, $scope) {
        'ngInject';

        this._Projects = Projects;
        this.projects = this._Projects.projects;

        
        this.startIdx = null;
        this.stopIdx = null;
        this.sortableProjectHandlers = {
            start: (event, ui) => {
                this.startIdx = ui.item.index();
            },
            stop: (event, ui) => {
                this.stopIdx = ui.item.index();
                this._Projects.updateProjectsOrderOnDrop(this.startIdx, this.stopIdx);
            }
        } 
    }

}

let ProjectList = {
    bindings: {},
    controller: ProjectListCtrl,
    templateUrl: 'components/project-helpers/project-list.html'
};

export default ProjectList;
