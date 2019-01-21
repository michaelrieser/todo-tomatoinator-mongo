class PomSummaryTaskBreadownChartCtrl {
    constructor(PomTracker, PomreportChartHelpers) {
        'ngInject';

        // NOTE: leveraging MVVM pattern with Aggregated Pomreport Charts
        this._PomTracker            = PomTracker;
        this._PomreportChartHelpers = PomreportChartHelpers;
    }
}

let PomSummaryTaskBreakdownChart =  {
    bindings: {},
    controller: PomSummaryTaskBreadownChartCtrl,
    templateUrl: 'components/pomreport-helpers/pom-summary-task-breakdown-chart.html'
};

export default PomSummaryTaskBreakdownChart;
