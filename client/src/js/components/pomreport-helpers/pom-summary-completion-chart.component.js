class PomSummaryCompletionChartCtrl {
    constructor(PomTracker, PomreportChartHelpers) {
        'ngInject';

        // NOTE: leveraging MVVM pattern with Aggregated Pomreport Charts
        this._PomTracker            = PomTracker;
        this._PomreportChartHelpers = PomreportChartHelpers;
    }
}

let PomSummaryCompletionChart =  {
    bindings: {},
    controller: PomSummaryCompletionChartCtrl,
    templateUrl: 'components/pomreport-helpers/pom-summary-completion-chart.html'
};

export default PomSummaryCompletionChart;
