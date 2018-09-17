class TaskNavbarCtrl {
    constructor($mdPanel, $mdMedia, ProjectPanel) {
        'ngInject';

        this._$mdMedia     = $mdMedia;
        this._ProjectPanel = ProjectPanel;
    }

    toggleProjectPanel(evt) {
        this._ProjectPanel.toggleProjectPanel();
    }
}

let TaskNavbar =  {
    bindings: {},
    controller: TaskNavbarCtrl,
    templateUrl: 'components/task-helpers/task-navbar.html'
};

export default TaskNavbar;
