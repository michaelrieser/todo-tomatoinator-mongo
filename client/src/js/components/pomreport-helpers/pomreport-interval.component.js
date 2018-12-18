class PomreportIntervalCtrl {
    constructor(AppConstants, $scope) {
        'ngInject';

        this._AppConstants = AppConstants;       

        this.calculateAndSetCompletionMetrics();                
    }

    calculateAndSetCompletionMetrics() {
        this.intervalSuccessful = this.pomtracker.intervalSuccessful; 

        this.trackerType = this.pomtracker.trackerType;
        
        this.completedIntervalMinutes = this.pomtracker.minutesElapsed;                
        this.targetIntervalMinutes = this._AppConstants.pomTimerData[this.trackerType];        

        this.intervalCompletionPercentage = this.getIntervalCompletionPercentage(this.completedIntervalMinutes, this.targetIntervalMinutes);
    }

    getIntervalCompletionPercentage(completedTime, targetTime) {
        return `${completedTime / targetTime * 100}%`;
    }

    boxPixelHeightFromIntervalType() {
        return `${this._AppConstants.pomTimerData[this.pomtracker.trackerType] * 2}px`;
    }

    isPomInterval() {
        return this.pomtracker.trackerType === 'pom';
    }
    
    setInnerBoxBottomBorderRadius() {
        return this.completedIntervalMinutes === this.targetIntervalMinutes ? '4px' : '4px 4px 0 0';
    }

}

let PomreportInterval =  {
    bindings: {
        pomtracker: '=',
        verboseinfo: '='
    },
    controller: PomreportIntervalCtrl,
    templateUrl: 'components/pomreport-helpers/pomreport-interval.html'
};

export default PomreportInterval;
