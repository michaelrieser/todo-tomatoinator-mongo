export default class PomTrackerHome {
    constructor(PomTracker) {
        'ngInject';

        this._PomTracker = PomTracker;

        this.setPomreportType = 'weekly';
        this.pomtrackerInfo = {};
        this.pomtrackers = [];
        this.offset = 0;

        // ***TODO: DELETE, kept for reference:
        // this.pomtrackerTimeCompletedGraphOptions = {
        //     elements: {
        //         line: {
        //             fill: false
        //         }
        //     },
        // }
        this.pomtrackerCombinedGraphDatasetOverride = [
            {
                label: 'Hours Completed',
                borderWidth: 2,
                type: 'line',
                fill: false
            },
            {
                label: 'Poms Completed',
                borderWidth: 1,
                type: 'bar'
            }
        ]
        this.pomtrackerCombinedGraphColors = ['#45b7cd', '#5cb85c', '#ff8e72'];
        this.pomtrackerCombinedGraphOptions = {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        suggestedMax: 16 // max unless there is a larger value in dataset
                    }
                }]
            }
        }
    }

    queryAndSet(stateParams) {
        if (stateParams.offset) { this.offset = parseInt(stateParams.offset); }
        else { this.offset = 0 }

        return this._PomTracker.query(stateParams).then(
            (res) => { return this.handleQueryResponse(res, stateParams); },
            (err) => { console.log(err); }
        )
    }

    handleQueryResponse(pomtrackerInfo, stateParams) {
        this.setPomtrackerFields(pomtrackerInfo);        
        this.calcAndSetPomtrackerGraphStats();
    }    
    setPomtrackerFields(pomtrackerInfo) {
        angular.copy(pomtrackerInfo, this.pomtrackerInfo);
        angular.copy(pomtrackerInfo.pomtrackers, this.pomtrackers);
        this.queryStartISO = pomtrackerInfo.queryStartISO;
        this.queryEndISO   = pomtrackerInfo.queryEndISO;
    }
    calcAndSetPomtrackerGraphStats() {
        this.pomtrackerDateMap = this.getPomtrackerDateMap();
        this.pomtrackerDateLabels = Object.keys(this.pomtrackerDateMap);
        this.pomtrackerTimeCompletedGraphData = this.getPomtrackerTimeCompletedGraphData();
        this.pomtrackerPomsCompletedGraphData = this.getPomtrackerPomsCompletedGraphData();
        this.pomtrackerCombinedGraphData = [this.pomtrackerTimeCompletedGraphData, this.pomtrackerPomsCompletedGraphData];
    }

    getPomtrackerDateMap() {
        let targetMoment = moment(this.queryStartISO);
        let endMoment    = moment(this.queryEndISO);
        let newPomtrackerDateMap = new Map();

        while(targetMoment.isSameOrBefore(endMoment)) {
            let displayDate = targetMoment.format('ddd MMM Do');
            let matchingPomtrackers = this.pomtrackers.filter((p) => {
                return p.trackerType === 'pom' && moment(p.updatedAt).isSame(targetMoment, 'day');
            });
            newPomtrackerDateMap[displayDate] = matchingPomtrackers;
            targetMoment.add(1, 'day');
        }
        return newPomtrackerDateMap;
    }

    getPomtrackerTimeCompletedGraphData() {
        let pomtrackerArraysInOrder = Object.values(this.pomtrackerDateMap);
        return pomtrackerArraysInOrder.map((pomtrackerArray) => {
            let minutesCompleted = pomtrackerArray.reduce((sum, p) => { return sum + p.minutesElapsed }, 0);            
            let hoursCompleted = minutesCompleted / 60;
            return Number(Math.round(hoursCompleted + 'e2') + 'e-2');            
        });
    }
    getPomtrackerPomsCompletedGraphData() {
        let pomtrackerArraysInOrder = Object.values(this.pomtrackerDateMap);
        return pomtrackerArraysInOrder.map((pomtrackerArray) => {
            return pomtrackerArray.reduce((sum, p) => { 
                return p.intervalSuccessful ? ++sum : sum;
            }, 0)
        })
    }
    getPomtrackerPomsAttemptedData() {

    }
    getTasksFromPomtrackers() {
        return this.pomtrackers.reduce( (taskMap, p) => {
            if (p.trackerType !== 'pom') { return taskMap; }
            let tgtTaskId = p.task._id; // use id to ensure uniqueness - tasks could potentially have identical titles
            let tgtTaskTitle = p.task.title;
            let tgtMinutesElapsed = p.minutesElapsed;
            let tgtTaskProject = p.task.project.title;            

            if (!(tgtTaskId in taskMap)) {
                taskMap[tgtTaskId] = { title: tgtTaskTitle, minutesElapsed: tgtMinutesElapsed, project: tgtTaskProject };
            } else {
                taskMap[tgtTaskId]['minutesElapsed'] += tgtMinutesElapsed;
                console.log('-', taskMap[tgtTaskId])
            }
            return taskMap;
        }, new Map())
    }
}
