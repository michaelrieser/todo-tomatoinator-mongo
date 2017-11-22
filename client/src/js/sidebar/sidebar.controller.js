// *** TODO: delete sidebar.component.js if this works for ui-view="sidebar" in abstract tasks route ***

class SidebarCtrl {
    constructor($scope) {
        'ngInject';

        console.log(this.projectsinfo);

        // this.projects = projectsInfo.projects;
        this._$scope = $scope;

        // this.resetProject();
    }
}

export default SidebarCtrl;