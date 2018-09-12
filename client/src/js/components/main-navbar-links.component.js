class MainNavbarLinksCtrl {
    constructor(Tasks, $state, $scope) {
        'ngInject';

        this._Tasks = Tasks;
        this._$state = $state;
    }

    // workaround for Tasks ng-href not setting ui-sref-active when clicked
    tasksViewActive() {
        return this._$state.current.name === 'app.tasks.view';
    }
}

let MainNavbarLinks =  {
    bindings: {},
    controller: MainNavbarLinksCtrl,
    templateUrl: 'components/main-navbar-links.html'
};

export default MainNavbarLinks;
