export default class PomTimer {
    constructor(AppConstants, PomTracker, $interval, $http) {
        'ngInject';

        this._AppConstants = AppConstants;
        this._PomTracker = PomTracker;
        this._$http = $http;

        this.setTimerType = null;
        this.timerData = { // TODO: could dynamically load this from user settings in tasks route
            // 'pom': 25, 
            'pom': .1, // .1 for testing
            // 'shortBrk': 5,
            'shortBrk': .1, // .1 for testing
            'longBrk': 10
        }

        this._$interval = $interval;        
        this.timerInterval = undefined;
        this.timerPaused = false;

        this.timeRemaining = 0; // seconds
        //   *Note - just using angular.isDefined(this.timerInterval) to determine if timer currently running        
        // this.timerRunning = false; // TODO: load these values from session || users settings (save every 10 secs?)

        // request permission on page load
        if (Notification.permission !== "granted") Notification.requestPermission();
    }

    resetIfNewTaskId(newTaskId) {
        if (!this.taskId) {
            this.taskId = newTaskId;
        } else { // NOTE: this may never be hit, since Tasks#toggleTaskActive sets taskId to null
            if (this.taskId !== newTaskId) { 
                console.log('***** WARNING: did not think we would hit this, investigate: PomTimer#resetIfNewTaskId() *****')
                this.resetTimer(); 
                this._PomTracker.resetPomTracker();
            }
        }
    }

    startTimer(timerType) {        
        if (!this.timerPaused) { 
            // ** NOTE: this was for stopping timer for everything but pom -> pom, now just stopping everything
            // var isBreak = timerType.indexOf('Brk') !== -1;
            // if (isBreak || (this.setTimerType && this.setTimerType.indexOf('Brk') !== -1)) { // starting break || break currently set
            //     this.stopTimer();
            // } else if (this.setTimerType && this.setTimerType === 'pom') {
            //     this.clearTimerInterval(); // QUESTION: unsure if necessary, as new interval doesn't appear to be created?
            // }
            // ** /NOTE
            if (this.setTimerType) { this.stopTimer(); }
            this.setTimerType = timerType;
        } else {
            var isBreak = timerType.indexOf('Brk') !== -1;
            if (isBreak) { this.resetTimer(); } // pressing Play(pom) will not reset timer, but breaks will
            this.timerPaused = false;
        }

        this.timeRemaining = this.timeRemaining || this.timerData[timerType] * 60;
        this.updateBrowserTitle(this.timeRemaining); // Interval below waits 1000ms to tick for the first time, need to set title initially here

        var endTime = new Date().getTime() + this.timeRemaining * 1000;
        
        this.timerInterval = this._$interval(() => {

            var currentTimeDelta = Math.round((endTime - new Date().getTime()) / 1000);

            this.timeRemaining = currentTimeDelta;
            this.updateBrowserTitle(this.timeRemaining);

            console.log(`timeRemaining: ${this.timeRemaining}`);

            if (this.timeRemaining % 2 === 0) { // FOR TESTING
            // if (this.timeRemaining % 60 === 0) {
                this.logTimeAndCloseIntervalIfComplete(currentTimeDelta);
            }
        }, 1000);
    }

    logTimeAndCloseIntervalIfComplete(currentTimeDelta) {
        this._PomTracker.logIntervalMinute().then(
            (res) => {
                if (currentTimeDelta <= 0) {
                    this.clearIntervalAndAlertUser();
                    this._PomTracker.closeInterval().then(
                        // *** TODO: this should DEFINITELY have error handling of some stripe ***
                        (res) => { console.log('*PomTracker interval closed successfully') },
                        (err) => { console.log('error closing PomTracker interval: ${err}') }
                    )
                }
            }
            // *NOTE: this doesn't do anything if error, need to check in res
            // (err) => { console.log(`error logging PomTracker minute: ${err}`) }
        )
    }


    clearIntervalAndAlertUser() {
        this.clearTimerInterval();
        this.buzzer();
        this.desktopAlert();
    }

    clearTimerInterval() {
        if (angular.isDefined(this.timerInterval)) {
            this._$interval.cancel(this.timerInterval);
            this.timerInterval = undefined; // cancelling interval in line above doesn't set this.timerInterval to undefined
        }
    }

    pauseTimer() {
        // if (!this.setTimerType) { return; }
        this.timerPaused = true;
        this.clearTimerInterval();
    }

    stopTimer() {
        this.clearTimerInterval();
        this.timeRemaining = 0;
        this.updateBrowserTitle(this.timeRemaining);
        this.setTimerType = null;
    }

    resetTimer() {
        this.clearTimerInterval();
        this.timeRemaining = 0;
        document.title = `Tasks - ${this._AppConstants.appName}` // TODO: See TODO on updateBrowserTitle()
        this.setTimerType = null;
    }

    clearAndResetTimer() {
        this.taskId = null;
        this.resetTimer();
        this._PomTracker.resetPomTracker();
    }

    /** 'PRIVATE' methods **/

    // TODO: DOM manipulation shouldn't occur in a service! Extract this to a directive?
    updateBrowserTitle(seconds) {
        if (seconds > 0) {
            document.title = `${this.secondsToMinSec(seconds)} \u2014 ${this._AppConstants.appName}`;
        } else {
            document.title = `Buzzz! \u2014 ${this._AppConstants.appName}`
        }
    }
    secondsToMinSec(seconds) {
        var min = Math.floor(seconds / 60);
        var secs = seconds - (min * 60);

        return `${('0' + min).slice(-2)}:${('0' + secs).slice(-2)}`;
    }

    // *** Notification Functionality *** //
    /*
    * from: notify.js - by Pratik Desai {desai@pratyk.com}
    * Enables Browser Desktop Notifications + Audio Notifications using <audio> tag
    *
    */
    // function to trigger notifications
    desktopAlert() {
        if (!Notification) {
            alert('Desktop notifications not available in your browser. Try Chrome, Firefox or Safari.');
            return;
        }
        if (Notification.permission !== "granted")
            Notification.requestPermission();
        else {
            var notification = new Notification('TomatoTimer', {
                icon: 'http://tomato-timer.com/tom.gif',
                body: "Your time is up!!",
            });
            setTimeout(notification.close.bind(notification), 7000);
            notification.onclick = function () {
                window.focus();
            };
        }
    }

    // control audio notifications
    buzzer() {
        // TODO: hardcoded for testing - remove once settings modal is implemented
        // var alertoption = localStorage.getItem("alertoption");
        var alertoption = 'ding';
        // var volumeoption = localStorage.getItem("volumeoption");
        var volumeoption = '0.5';

        var soundsPath = 'assets/sounds/';

        var choice = new Array();
        choice[0] = soundsPath + alertoption + '.mp3';
        choice[1] = soundsPath + alertoption + '.ogg';
        choice[2] = soundsPath + alertoption + '.wav';

        // this.playAudio();

        var alarm = new Howl({
            urls: choice,
            volume: volumeoption
        });
        alarm.play();
    }

    // playAudio() {
    //     var audio = new Audio('ding.mp3');
    //     // audio.load();
    //     audio.play();
    // }

}