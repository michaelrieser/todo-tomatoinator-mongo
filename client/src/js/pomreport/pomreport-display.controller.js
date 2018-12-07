class PomreportDisplayCtrl {
  constructor(pomtrackerInfo, PomTracker) {
    'ngInject';
  
    this.pomtrackerInfo = PomTracker.pomtrackerInfo;
    this.pomtrackers = PomTracker.pomtrackers;
  }
}

export default PomreportDisplayCtrl;

