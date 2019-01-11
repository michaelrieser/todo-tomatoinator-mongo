class PomreportWeekListCtrl {
    constructor(PomTracker) {
        'ngInject';

        // console.log('weekly - pomtrackers:');
        // console.log(this.pomtrackers);

        this._PomTracker = PomTracker;
        this.calcAndSetStats();

        Chart.defaults.global.tooltipFontSize = 24;

        this.pieChartLabels = ['Completed Minutes', 'Missed Minutes'];
        this.pieChartData   = [this.completedActiveMinutes, this.missedMinutes];
        this.pieChartColors = ['#87cefa', '#cd5c5c'];
        // **NOTE: for custom label, SEE: https://www.chartjs.org/docs/latest/configuration/tooltip.html#label-color-callback
        // this.pieChartOptions = {
        //     tooltips: {
        //         // tooltipTemplate: function(label) {
        //         //     return 'poop';
        //         // }
        //         // enabled: false
        //         callbacks: {
        //             label: function(tooltipItem, data) {
        //                 // console.log('tooltipItem: ', tooltipItem);
        //                 // console.log('data: ', data);
        //                 let datasetIndex = tooltipItem.datasetIndex;
        //                 let data = data.datasets[datasetIndex];
        //                 let formattedData = @WIP
        //                 let label = data.labels[datasetIndex];

        //             }
        //         }
        //     }
        // }
    }

    calcAndSetStats() {        
        this.completedPoms          = this._PomTracker.calcCompletedPoms(this.pomtrackers);
        this.attemptedPoms          = this._PomTracker.calcAttemptedPoms(this.pomtrackers);
        this.rawPomCompletionPct    = this._PomTracker.calcRawPomCompletionPct(this.completedPoms, this.attemptedPoms);
        this.timesPaused            = this._PomTracker.calcTimesPaused(this.pomtrackers);
        this.completedActiveMinutes = this._PomTracker.calcCompletedActiveMinutes(this.pomtrackers);
        this.potentialActiveMinutes = this._PomTracker.calcPotentialActiveMinutes(this.attemptedPoms);
        this.missedMinutes          = this.potentialActiveMinutes - this.completedActiveMinutes;
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
