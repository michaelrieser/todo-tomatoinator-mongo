export default class PomTracker {
    constructor(AppConstants, $http) {
        'ngInject';

        this._AppConstants = AppConstants;
        this._$http = $http;

        this.pomTracker = null; 
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
        this.pomTrackerId = null;
    }
    handleCloseResponse(res) {
        this.resetPomTracker();        
        return res;
    }

    resetPomTracker() {        
        this.pomTracker = null;
    }
    
}
