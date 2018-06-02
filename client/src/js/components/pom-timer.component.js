class PomTimerCtrl {
    constructor(PomTimer, $scope, $interval, AppConstants) {
        'ngInject';

        this._PomTimer = PomTimer;
        this.timeRemaining = PomTimer.timeRemaining;

        this._PomTimer.resetIfNewTaskId(this.taskid)

        $scope.$watch(() => {return this._PomTimer.timeRemaining}, (newValue) => {                
            this.timeRemaining = newValue;
        })        

        // TODO: add method/finalize event for when new pom-timer component is created?

    }    

    startTimer(timerType) {                
        this._PomTimer.startTimer(timerType);
    }

    pauseTimer() {
        this._PomTimer.pauseTimer();
    }

    stopTimer() {
        this._PomTimer.stopTimer();
    }

    resetTimer() {
        this._PomTimer.resetTimer();
    }

}

let PomTimer = {
    bindings: {
        taskid: '=',
    },
    controller: PomTimerCtrl,
    templateUrl: 'components/pom-timer.html'
};

export default PomTimer;
