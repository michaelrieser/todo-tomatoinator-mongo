class PomTimerCtrl {
    constructor(PomTimer, PomTracker, $scope, $interval, $q, AppConstants) {
        'ngInject';

        this._PomTimer = PomTimer;
        this._PomTracker = PomTracker;
        this._$q = $q;

        this.timeRemaining = PomTimer.timeRemaining;

        this._PomTimer.resetIfNewTaskId(this.task.id)

        $scope.$watch(() => {return this._PomTimer.timeRemaining}, (newValue) => {                
            this.timeRemaining = newValue;
        })        

        // TODO: add method/finalize event for when new pom-timer component is created?

    }    

    startTimer(timerType) {  
        this._$q.when(
            this._PomTracker.buildPomTracker(this.task, timerType)
        ).then((res) => {            
            if (res.status && res.status !== 200) { // create succeeded with HTTP 200 success
                // TODO: inform user and/or try again?
                console.log('ERROR: ', res.statusText);
            } else { // timer already created || created with HTTP 200 success
                this._PomTimer.startTimer(timerType);                                
            }            
        })
    }

    pauseTimer() {
        // TODO/QUESTION: call PomTracker.logPomInterruption ?
        this._PomTimer.pauseTimer();
    }

    stopTimer() {
        // TODO/QUESTION: call PomTracker.closePomEntry(<flag-to-specify-incomplete>) ?
        this._PomTimer.stopTimer();
    }

    resetTimer() {
        // TODO/QUESTION: call PomTracker.closePomEntry(<flag-to-specify-incomplete>) ?        
        this._PomTimer.resetTimer();
    }

}

let PomTimer = {
    bindings: {
        task: '=',
    },
    controller: PomTimerCtrl,
    templateUrl: 'components/pom-timer.html'
};

export default PomTimer;
