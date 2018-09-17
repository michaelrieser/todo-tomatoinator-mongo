class ProjectPanelCtrl {
  // NOTE: mdPanelReference(resolved from $mdPanel.open()) may be passed to panel ctrl ctor
  constructor(mdPanelRef, Projects, $scope, $mdMedia) {
    'ngInject';

    this._mdPanelRef = mdPanelRef;
    this._Projects   = Projects;
    this.projects    = this._Projects.projects;
    this._$scope     = $scope;
    this._$mdMedia   = $mdMedia;

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

    this._$scope.$watch( () => { return this._$mdMedia('min-width: 769px')}, 
        (isLargeScreen) => {
            if (isLargeScreen) this._mdPanelRef.close();
            // else this._mdPanelRef.open(); // causes infinite digest loop (10 reached), ok just to close
        })
  }
}

// TODO/QUESTION => adding method to prototype doesn't work, but examples do so successfully?
//  ** SEE: https://material.angularjs.org/latest/demo/panel
// ProjectPanelCtrl.prototype.testMethod = () => {
//   console.log('testMethod()')
// }

export default ProjectPanelCtrl;
