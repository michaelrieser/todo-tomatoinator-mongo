// *** TODO: delete sidebar.component.js if this works for ui-view="sidebar" in abstract tasks route ***

class SidebarCtrl {
    constructor($scope) {
        'ngInject';

        this.projectsInfo = $scope.$parent.$ctrl.projectsInfo;
        this.projects = this.projectsInfo.projects;

        this._$scope = $scope;
    }
}

export default SidebarCtrl;