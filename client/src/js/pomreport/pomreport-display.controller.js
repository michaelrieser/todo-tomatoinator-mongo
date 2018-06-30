class PomreportDisplayCtrl {
  constructor(pomtrackerInfo, PomTracker) {
    'ngInject';
  
    this.pomtrackerInfo = pomtrackerInfo;
    this.pomtrackers = this.pomtrackerInfo.pomtrackers;

  }
}

export default PomreportDisplayCtrl;

