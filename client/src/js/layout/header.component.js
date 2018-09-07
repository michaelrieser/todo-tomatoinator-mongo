class AppHeaderCtrl {
  constructor(AppConstants, Tasks, $state) {
    'ngInject';
    
    this._$state = $state;
    this._Tasks = Tasks;        

    this.appName = AppConstants.appName;
  }
  
  // workaround for Tasks ng-href not setting ui-sref-active when clicked
  tasksViewActive() {
    return this._$state.current.name === 'app.tasks.view';
  }
}

let AppHeader = {
  controller: AppHeaderCtrl,
  templateUrl: 'layout/header.html'
};

export default AppHeader;
