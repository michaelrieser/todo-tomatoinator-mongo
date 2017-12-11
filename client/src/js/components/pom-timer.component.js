class PomTimerCtrl {
    // TODO: create PomService to make backend calls for updating time spent on tasks? -OR- just put in tasks.service.js
    constructor(PomTimer, $scope, $interval, AppConstants) {
        'ngInject';

        this._PomTimer = PomTimer;
        this.timeRemaining = PomTimer.timeRemaining;

        this._PomTimer.resetTimer(); // Clear residual timer (if any) from previously active task

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
    },
    controller: PomTimerCtrl,
    templateUrl: 'components/pom-timer.html'
};

export default PomTimer;
