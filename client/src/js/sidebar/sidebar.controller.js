// *** TODO: delete sidebar.component.js if this works for ui-view="sidebar" in abstract tasks route ***

class SidebarCtrl {
    constructor(projectsInfo, $scope) {
        'ngInject';

        this.projects = projectsInfo.projects;
        this._$scope = $scope;

        // this.resetProject();
    }
}

export default SidebarCtrl;