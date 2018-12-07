class PomreportSummaryDailyCtrl {
    constructor(PomTracker) {
        'ngInject';

        this._PomTracker = PomTracker;
    }
}

let PomreportSummaryDaily =  {
    bindings: {},
    controller: PomreportSummaryDailyCtrl,
    templateUrl: 'components/pomreport-helpers/pomreport-summary-daily.html'
};

export default PomreportSummaryDaily;
