class PomreportSummaryMonthlyCtrl {
    constructor(PomTracker, PomreportChartHelpers) {
        'ngInject';

        // NOTE: leveraging MVVM pattern with Aggregated Pomreport Charts
        this._PomTracker            = PomTracker;
        this._PomreportChartHelpers = PomreportChartHelpers;
    }
}

let PomreportSummaryMonthly =  {
    bindings: {},
    controller: PomreportSummaryMonthlyCtrl,
    templateUrl: 'components/pomreport-helpers/pomreport-summary-monthly.html'
};

export default PomreportSummaryMonthly;
