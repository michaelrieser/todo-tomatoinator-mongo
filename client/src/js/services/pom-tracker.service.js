export default class PomTracker {
    constructor(AppConstants, $http) {
        'ngInject';

        this._AppConstants = AppConstants;
        this._$http = $http;

        this.pomTracker = null; 
        this.pomtrackerInfo = {};
        this.pomtrackers = [];
        this.completedPoms = 0;
        this.attemptedPoms = 0;
        this.timesPaused = 0;
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
            data: { pomTracker: {trackerType: trackerType, task: taskId, user: userId} }            
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
        var queryConfig = {};
        queryConfig.filters = stateParams || null;

        let request = {
            url: `${this._AppConstants.api}/pomtracker`,
            method: 'GET',
            params: queryConfig.filters ? queryConfig.filters : null
        }

        return this._$http(request).then(
            (res) => { return this.handleQueryResponse(res.data); },
            (err) => { console.log(err); }
        );
    }

    handleQueryResponse(pomtrackerInfo) {
        angular.copy(pomtrackerInfo, this.pomtrackerInfo);
        angular.copy(pomtrackerInfo.pomtrackers, this.pomtrackers);
        this.calcAndSetStats();

        return pomtrackerInfo;
    }

    calcAndSetStats() {
        this.completedPoms = this.calcCompletedPoms();
        this.attemptedPoms = this.calcAttemptedPoms();
        this.rawPomCompletionPct = this.calcRawPomCompletionPct();
        this.timesPaused   = this.calcTimesPaused();
    }
    calcCompletedPoms() {
        return this.pomtrackers.reduce( (sum, p) => {
            if (p.trackerType !== 'pom') return sum;
            return p.intervalSuccessful ? ++sum : sum;
        }, 0)
    }
    calcAttemptedPoms() {
        let attemptedPoms = this.pomtrackers.reduce( (sum, p) => { return p.trackerType === 'pom' ? ++sum : sum}, 0);
        return (this.pomTracker && this.pomTracker.trackerType === 'pom') ? attemptedPoms - 1 : attemptedPoms; // subtract 1 if pomtracker currently in progress
    }
    calcRawPomCompletionPct() {
        if (this.attemptedPoms === 0) { return 0; }
        return (this.completedPoms / this.attemptedPoms) * 100;
    }
    calcTimesPaused() {
        return this.pomtrackers.reduce( (sum, p) => { return sum += p.timesPaused }, 0);
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
}
