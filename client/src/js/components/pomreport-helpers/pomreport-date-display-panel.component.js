class PomreportDateDisplayPanelCtrl {
    constructor(PomTracker, $state, $scope) {
        'ngInject';

        this._$state = $state;
        this._$scope = $scope;
    }

    getOffsetState(tgtOffset) {
        return this._$state.href(this.tgtroute, {type: this.tgtobject.setPomreoprtType, offset: this.tgtobject.offset + tgtOffset})
    }
}

let PomreportDateDisplayPanel =  {
    bindings: {
        tgtroute: '=',
        tgtobject: '=' // Either PomTracker service (pomreports) || home controller(for now)
    },
    controller: PomreportDateDisplayPanelCtrl,
    templateUrl: 'components/pomreport-helpers/pomreport-date-display-panel.html'
};

export default PomreportDateDisplayPanel;
