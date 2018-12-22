var mongoose = require('mongoose');

var PomTrackerSchema = new mongoose.Schema({
    // TODO/QUESTION: add order field and increment by 1 each time in POST /pomtracker/
    //                *would make it easier to stratify pom trackers (tho date would still work)
    trackerType: { type: String, enum: ['pom', 'shortBrk', 'longBrk'] },
    minutesElapsed: { type: Number, default: 0 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    taskIdString: { type: String },
    initialTaskTitle: { type: String },
    timesPaused: { type: Number, default: 0 },    
    intervalSuccessful: { type: Boolean, default: false }, // set to false by default and force app to set to true (handles refreshing and losing pomTrackerId from PomTracker service)
    closed: { type: Boolean, default: false }, // closed + !intervalSuccessful => STOPPED | !closed + !intervalSuccessful => PAGE REFRESH || ERROR(?) 
    closedTime: { type: mongoose.Schema.Types.Date }     
    // TODO/QUESTION => create formatted YYYYMMDD date in pre middleware or just handle accordingly in GET /pomtracker?
}, {timestamps: true});

// NOTE: was initially going to create new PomTracker in logTime and subtract 1 min from create time, but that seemed suspect at best
// PomTrackerSchema.pre('save', function(next) {
//     if (this.isNew) { // TODO: see https://medium.com/@justinmanalad/pre-save-hooks-in-mongoose-js-cf1c0959dba2
        
//     }
//     next();
// });

PomTrackerSchema.methods.toJSON = function() {
    return {
      id: this.id,
      trackerType: this.trackerType,
      minutesElapsed: this.minutesElapsed,
      user: this.user,
      task: this.task,
      taskIdString: this.taskIdString, // for pomtracker query if task was deleted, NOTE: couldn't find out how to populate task ID if no task doc found
      initialTaskTitle: this.initialTaskTitle, // for display if task was deleted
      timesPaused: this.timesPaused,
      intervalSuccessful: this.intervalSuccessful,
      closed: this.closed,
      closedTime: this.closedTime,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
};

mongoose.model('PomTracker', PomTrackerSchema);
