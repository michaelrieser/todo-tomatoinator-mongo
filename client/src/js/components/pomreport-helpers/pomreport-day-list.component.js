class PomreportDayListCtrl {
    constructor(PomTracker) {
        'ngInject';

        this._PomTracker = PomTracker;
    }
}

let PomreportDayList =  {
    bindings: {
        pomtrackers: '=',
        verboseinfo: '='
    },
    controller: PomreportDayListCtrl,
    templateUrl: 'components/pomreport-helpers/pomreport-day-list.html'
};

export default PomreportDayList;
