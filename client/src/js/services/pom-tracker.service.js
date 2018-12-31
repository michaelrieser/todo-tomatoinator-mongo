export default class PomTracker {
    constructor(AppConstants, $http) {
        'ngInject';

        this._AppConstants = AppConstants;
        this._$http = $http;

        this.pomTracker = null; 
        this.pomtrackerInfo = {};
        this.pomtrackers = [];
        this.pomtrackersSortedByDate = {};

        this.completedPoms = 0;
        this.attemptedPoms = 0;
        this.timesPaused = 0;

        this.queryStartISO;
        this.queryEndISO;
        this.offset = 0;
    }

    // returns true (coerced from set pomTracker instance) if PomEntry already created, otherwise calls createPomTracker and creates new
    resetAndBuildPomTracker(task, trackerType) {
        // TODO/IDEA: could have additional notes(?) field in PomTracker that could say 'Pom interrupted by break || Break ended prematurely etc..'
        if (this.pomTracker) { this.resetPomTracker(); } // making everything overrideable
        return this.createPomTracker(task, trackerType);
    }

    createPomTracker(task, trackerType) {
        let taskId = task.id;
        let userId = task.user.id;
        let request = {
            url: `${this._AppConstants.api}/pomtracker/`,
            method: 'POST',
            data: { pomTracker: {trackerType: trackerType, task: taskId, 
                                 initialTaskTitle: task.title, user: userId,
                                 taskIdString: taskId} }            
        }
        return this._$http(request).then(
            (res) => { return this.handleCreateSuccess(res); },
            (err) => { return err; }
        );
    }
    handleCreateSuccess(res) {                
        this.pomTracker = res.data.pomTracker;
        return res; 
    }

    logIntervalMinute() {
        let request = {
            url: `${this._AppConstants.api}/pomtracker/logpomminute/`,
            method: 'PUT',
            data: { pomTrackerId: this.pomTracker.id }            
        }        
        return this._$http(request).then(
            (res) => { return res; },
            (err) => { return err; }
        )
    }

    incrementPause() {
        if (!this.pomTracker) { return true; }
        let request = {
            url: `${this._AppConstants.api}/pomtracker/incrementpause`,
            method: 'PUT',
            data: { pomTrackerId: this.pomTracker.id }
        }
        return this._$http(request).then(
            (res) => { return res; },
            (err) => { return err; }
        )
    }

    closeInterval(intervalSuccessful=true) {
        if (!this.pomTracker) { return true; } // if task set to complete when no pomTracker is set

        let tgtPomTracker = this.pomTracker;
        tgtPomTracker.intervalSuccessful = intervalSuccessful;

        let request = {
            url: `${this._AppConstants.api}/pomtracker/`,
            method: 'PUT',
            data: { pomTracker: tgtPomTracker }
        }

        return this._$http(request).then(
            (res) => { return this.handleCloseResponse(res); },
            (err) => { return err; }
        )
        this.pomTracker = null; // TODO: think we need to set this.pomTracker to null here (was using pomTrackerId before?)
    }
    handleCloseResponse(res) {
        this.resetPomTracker();        
        return res;
    }

    resetPomTracker() {        
        this.pomTracker = null;
    }
    // TODO/INFO: kept for reference, but can probably delete
    // query(stateParams = {}) {
    //     var queryConfig = {};
    //     queryConfig.filters = stateParams || null;

    //     let request = {
    //         url: `${this._AppConstants.api}/pomtracker`,
    //         method: 'GET',
    //         params: queryConfig.filters ? queryConfig.filters : null
    //     }

    //     return this._$http(request).then(
    //         (res) => { return res.data; },
    //         (err) => { console.log(err); }
    //     );
    // }

    queryAndSet(stateParams = {}) {
        // Delete offset if moving to a new pomreport type (ex: 'daily' => 'weekly') - NOTE: prior offset remains in query string if passed prior (akin to /tasks projects & status)
        if (stateParams.offset && stateParams.type !== this.setPomreportType) {
            delete stateParams.offset;
        }
        var queryConfig = {};
        queryConfig.filters = stateParams || null;

        // Leverage Internationalization API to guess browser's timezone        
        queryConfig.filters.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        let request = {
            url: `${this._AppConstants.api}/pomtracker`,
            method: 'GET',
            params: queryConfig.filters ? queryConfig.filters : null
        }

        return this._$http(request).then(
            (res) => { return this.handleQueryResponse(res.data, stateParams); },
            (err) => { console.log(err); }
        );
    }

    handleQueryResponse(pomtrackerInfo, stateParams) {        
        if (stateParams.offset) { this.offset = parseInt(stateParams.offset); }
        else { this.offset = 0; } // reset to 0 when moving between types (ex: 'daily' => 'weekly'). ALSO resets offset to 0 when coming back from another page (ex: Tasks => PomReport)


        angular.copy(pomtrackerInfo, this.pomtrackerInfo);
        angular.copy(pomtrackerInfo.pomtrackers, this.pomtrackers);
        this.queryStartISO = pomtrackerInfo.queryStartISO;
        this.queryEndISO   = pomtrackerInfo.queryEndISO;

        this.setPomreportType = stateParams.type;
        
        this.calcAndSetStats();

        this.setSortedPomtrackers();

        return pomtrackerInfo;
    }

    setSortedPomtrackers() {
        if (this.setPomreportType !== 'monthly') {
            this.setDailyWeeklyPomtrackers();
        } else {
            this.setMonthlyPomtrackers();
        }
    }

    setDailyWeeklyPomtrackers() {
        // METHOD 1 - kept for reference
        // this.pomtrackersSortedByDate = this.pomtrackers.reduce( (sortedPomTrackers, p) => {
        //     let currentMoment = moment(p.updatedAt);
        //     let existingDateStrings = Object.keys(sortedPomTrackers);

        //     let displayDate = currentMoment.format('ddd MMM Do'); // EX: Sun Jan 1st
        //     let displayDateInExisting = existingDateStrings.find( (d) => displayDate === d);

        //     if (displayDateInExisting) {
        //         sortedPomTrackers[displayDate].push(p);
        //     } else {                
        //         sortedPomTrackers[displayDate] = [p];
        //     }
        //     return sortedPomTrackers;
        // }, {})

        // METHOD 2 - full REFACTOR - setting empty days in same loop
        let targetMoment = moment(this.queryStartISO);
        let iterations = this.setPomreportType === 'daily' ? 1 : 7;
        let newPomtrackersSortedByDate = {};

        for (var i = 0; i < iterations; i++) {            
            let displayDate = targetMoment.format('ddd MMM Do');
            let matchingPomtrackers = this.pomtrackers.filter( (p) => { return moment(p.updatedAt).isSame(targetMoment, 'day') });            
            newPomtrackersSortedByDate[displayDate] = matchingPomtrackers;
            targetMoment.add(1, 'day');            
        }
        angular.copy(newPomtrackersSortedByDate, this.pomtrackersSortedByDate);
    }    
    setMonthlyPomtrackers() {
        // TODO
    }

    calcAndSetStats() {        
        this.completedPoms = this.calcCompletedPoms();
        this.attemptedPoms = this.calcAttemptedPoms();
        this.rawPomCompletionPct = this.calcRawPomCompletionPct();
        this.timesPaused   = this.calcTimesPaused();
        this.completedActiveMinutes = this.calcCompletedActiveMinutes();
        this.potentialActiveMinutes = this.calcPotentialActiveMinutes();
    }
    calcCompletedPoms() {
        return this.pomtrackers.reduce( (sum, p) => {
            if (p.trackerType !== 'pom') return sum;
            return p.intervalSuccessful ? ++sum : sum;
        }, 0)
    }
    calcAttemptedPoms() {
        let attemptedPoms = this.pomtrackers.reduce( (sum, p) => { return p.trackerType === 'pom' ? ++sum : sum}, 0);
        return (this.pomTracker && this.pomTracker.trackerType === 'pom') ? attemptedPoms - 1 : attemptedPoms; // subtract 1 if pomtracker('pom') currently in progress
    }
    calcRawPomCompletionPct() {
        if (this.attemptedPoms === 0) { return 0; }
        return (this.completedPoms / this.attemptedPoms) * 100;
    }
    calcTimesPaused() {
        return this.pomtrackers.reduce( (sum, p) => { return sum += p.timesPaused }, 0);
    }
    calcCompletedActiveMinutes() {       
        // create deep copy of pomtrackers and pop last tracker if it is an active pom
        let targetPomtrackers = angular.copy(this.pomtrackers);        
        if (this.pomTracker && this.pomTracker.trackerType === 'pom') { targetPomtrackers.pop(); }

        return targetPomtrackers.reduce( (sum, p) => { return (p.trackerType === 'pom') ? sum += p.minutesElapsed : sum }, 0);
    }
    calcPotentialActiveMinutes() {
        return this.attemptedPoms * 25;
    }
    
    colorBasedOnCompletionPct() {
        if (this.rawPomCompletionPct >= 90) {
            return 'green';
        } else if (this.rawPomCompletionPct >= 80) {
            return 'yellow-green';
        } else if (this.rawPomCompletionPct >= 70) {
            return 'yellow-orange';
        } else if (this.rawPomCompletionPct >= 60) {
            return 'red-orange';
        } else if (this.rawPomCompletionPct > 0) {
            return 'red';
        } else {
            return 'black';
        }
    }

    getPomtrackerTaskInfo(targetTaskID) {
        let request = {
            url: `${this._AppConstants.api}/pomtracker/taskinfo`,
            method: 'GET',
            params: { taskID: targetTaskID }            
        }
        return this._$http(request).then(
            (res) => { return res; },
            (err) => { return err; }
        );        
    }
}
