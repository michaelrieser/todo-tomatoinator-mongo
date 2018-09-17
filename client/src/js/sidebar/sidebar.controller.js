// *** TODO: delete sidebar.component.js if this works for ui-view="sidebar" in abstract tasks route ***

class SidebarCtrl {
    constructor($scope, $mdMedia) {
        'ngInject';

        this._$mdMedia = $mdMedia;
        this._$scope = $scope;

    }
}

export default SidebarCtrl;