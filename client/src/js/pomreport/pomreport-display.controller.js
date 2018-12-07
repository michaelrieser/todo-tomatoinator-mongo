class PomreportDisplayCtrl {
  constructor(pomtrackerInfo, PomTracker) {
    'ngInject';
  
    // this.pomtrackerInfo = pomtrackerInfo;
    // this.pomtrackers = this.pomtrackerInfo.pomtrackers;
    this.pomtrackerInfo = PomTracker.pomtrackerInfo;
    this.pomtrackers = PomTracker.pomtrackers;

    console.log('PomTracker.completedPoms: ', PomTracker.completedPoms);
    console.log('PomTracker.attemptedPoms: ', PomTracker.attemptedPoms);

    // this.completedPoms = this.calcCompletedPoms();
    // this.attemptedPoms = this.calcAttemptedPoms();
    // console.log('this.completedPoms: ', this.completedPoms);
    // console.log('this.attemptedPoms: ', this.attemptedPoms)
  }
}

export default PomreportDisplayCtrl;

