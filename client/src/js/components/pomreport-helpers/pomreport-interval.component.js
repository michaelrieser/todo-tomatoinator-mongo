class PomreportIntervalCtrl {
    constructor(AppConstants, PomTracker, PomtrackerInfoPanel, $scope) {
        'ngInject';

        this._AppConstants = AppConstants;
        this._PomTracker = PomTracker;
        this._PomtrackerInfoPanel = PomtrackerInfoPanel;

        this.taskMissingTitle = false;
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

    getTaskTitle() {
        if (this.pomtracker.task) {
            return this.pomtracker.task.title;
        } else if (this.pomtracker.initialTaskTitle) {
            return this.pomtracker.initialTaskTitle;
        } else {
            this.taskMissingTitle = true;
            return '<task-not-found>';            
        }
    }

    queryAndDisplayPomtrackerInfoPanelIfPom(evt) {
        if (!this.isPomInterval()) { return; }
        let targetTaskID = this.pomtracker.task ? this.pomtracker.task._id : this.pomtracker.taskIdString;
        this._PomtrackerInfoPanel.queryAndDisplayPomtrackerInfoPanel(evt, targetTaskID, this.pomtracker);
    }

    intervalSucceeded() {
        return this.pomtracker.intervalSuccessful;
    }

    intervalIsActive() {
        if (!(this.pomtracker.trackerType === 'pom') || !this._PomTracker.pomTracker) { return false; }
        return this._PomTracker.pomTracker.id === this.pomtracker.id;
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
