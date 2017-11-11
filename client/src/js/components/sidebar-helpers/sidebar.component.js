class SidebarCtrl {
    constructor($scope) {
        'ngInject';

        this._Projects = Projects;
        this._$scope = $scope;

        this.resetProject();
    }
}

let Sidebar =  {
    bindings: {
        projects: '=',
    },
    controller: SidebarCtrl,
    templateUrl: 'components/sidebar-helpers/sidebar.component.js'
};

export default Sidebar;
