class PomreportSummaryWeeklyCtrl {
    constructor(PomTracker) {
        'ngInject';

        this._PomTracker = PomTracker;
    }
}

let PomreportSummaryWeekly =  {
    bindings: {},
    controller: PomreportSummaryWeeklyCtrl,
    templateUrl: 'components/pomreport-helpers/pomreport-summary-weekly.html'
};

export default PomreportSummaryWeekly;
