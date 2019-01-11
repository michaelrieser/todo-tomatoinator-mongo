class PomreportSummaryMonthlyCtrl {
    constructor(PomTracker) {
        'ngInject';

        this._PomTracker = PomTracker;
    }
}

let PomreportSummaryMonthly =  {
    bindings: {},
    controller: PomreportSummaryMonthlyCtrl,
    templateUrl: 'components/pomreport-helpers/pomreport-summary-monthly.html'
};

export default PomreportSummaryMonthly;
