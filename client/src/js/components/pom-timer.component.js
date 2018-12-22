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
            // only reset and create new PomTracker if PomTimer is NOT ( paused and pressing Play(pom) )
            this._PomTimer.timerPaused  && timerType === 'pom' ? true : this._PomTracker.resetAndBuildPomTracker(this.task, timerType)
        ).then((res) => {            
            if (res.status && res.status !== 200) { // error
                // TODO: inform user and/or try again?
                console.log('ERROR: ', res.statusText);
            } else { // timer created with HTTP 200 success
                this._PomTimer.startTimer(timerType);                                
            }            
        })
    }

    pauseTimer() { 
        if (this._PomTimer.timerPaused || !this._PomTimer.setTimerType) { return; }
        this._$q.when(
            this._PomTracker.incrementPause()
        ).then( (res) => {
            console.log(res)
            if (res.status && res.status !== 204) { // Expecting 204: No Content
                console.log('ERROR: ', res.statusText);
            } else {
                console.log('SUCCESS')
                this._PomTimer.pauseTimer()
            }
        })
        
    }

    stopTimer() {
        this._PomTracker.closeInterval(false).then( (res) => {
            if (res.status && res.status !== 200) {
                // TODO: alert user
                console.log('ERROR: ', res.statusText);
            } else {
                this._PomTimer.stopTimer();
            }
        })
    }

    resetTimer() {
        this._PomTracker.closeInterval(false).then( (res) => {
            if (res.status && res.status !== 200) {
                // TODO: alert user
                console.log('ERROR: ', res.statusText);
            } else {
                this._PomTimer.resetTimer();                
            }
        })           
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
