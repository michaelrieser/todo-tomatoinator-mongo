class PomreportDisplayCtrl {
  constructor(pomtrackerInfo, PomTracker) {
    'ngInject';
  
    this._PomTracker = PomTracker;

    this.pomtrackerInfo = this._PomTracker.pomtrackerInfo;
    this.pomtrackers = this._PomTracker.pomtrackers;
  }
}

export default PomreportDisplayCtrl;

