class PomreportSummaryCtrl {
    constructor(PomTracker) {
        'ngInject';

        // NOTE: leveraging MVVM pattern with Aggregated Pomreport Charts
        this._PomTracker = PomTracker;
    }
}

let PomreportSummary =  {
    bindings: {},
    controller: PomreportSummaryCtrl,
    templateUrl: 'components/pomreport-helpers/pomreport-summary.html'
};

export default PomreportSummary;
