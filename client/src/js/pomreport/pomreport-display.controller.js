class PomreportDisplayCtrl {
  constructor(pomtrackerInfo, PomTracker) {
    'ngInject';

    this._PomTracker = PomTracker;

    this.pomtrackerInfo = this._PomTracker.pomtrackerInfo;
    this.pomtrackersSortedByDate = this._PomTracker.pomtrackersSortedByDate;
  }
}

export default PomreportDisplayCtrl;

