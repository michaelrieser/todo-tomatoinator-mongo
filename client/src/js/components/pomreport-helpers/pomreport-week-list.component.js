class PomreportWeekListCtrl {
    constructor(PomTracker, PomreportChartHelpers, $filter) {
        'ngInject';        

        this._PomTracker            = PomTracker;
        this._PomreportChartHelpers = PomreportChartHelpers;
        this._$filter               = $filter;
        
        this.calcAndSetStats();

        this.completionMinsPieChartLabels  = this._PomreportChartHelpers.completionMinsPieChartLabels;
        this.completionMinsPieChartData    = [this.completedActiveMinutes, this.missedMinutes];
        this.completionMinsPieChartColors  = this._PomreportChartHelpers.completionMinsPieChartColors;
        this.completionMinsPieChartOptions = this._PomreportChartHelpers.completionMinsPieChartOptions;

        this.pomtrackerTaskTimeMap        = this._PomTracker.getPomtrackerTaskTimeMap(this.pomtrackers);       
        this.taskBreakdownPieChartLabels  = Object.keys(this.pomtrackerTaskTimeMap);
        this.taskBreakdownPieChartData    = Object.values(this.pomtrackerTaskTimeMap);        
        this.taskBreakdownPieChartColors  = this._PomreportChartHelpers.getStratifiedTaskChartColors(this.taskBreakdownPieChartLabels);
    }

    calcAndSetStats() {        
        this.completedPoms          = this._PomTracker.calcCompletedPoms(this.pomtrackers);
        this.attemptedPoms          = this._PomTracker.calcAttemptedPoms(this.pomtrackers);
        this.rawPomCompletionPct    = this._PomTracker.calcRawPomCompletionPct(this.completedPoms, this.attemptedPoms);
        this.timesPaused            = this._PomTracker.calcTimesPaused(this.pomtrackers);
        this.completedActiveMinutes = this._PomTracker.calcCompletedActiveMinutes(this.pomtrackers);
        this.potentialActiveMinutes = this._PomTracker.calcPotentialActiveMinutes(this.pomtrackers);
        this.missedMinutes          = this.potentialActiveMinutes - this.completedActiveMinutes;
    }

    noPomCompletionData() {
        return this.potentialActiveMinutes === 0;
    }

}

let PomreportWeekList =  {
    bindings: {
        pomtrackers: '=',
        date: '='
    },
    controller: PomreportWeekListCtrl,
    templateUrl: 'components/pomreport-helpers/pomreport-week-list.html'
};

export default PomreportWeekList;
