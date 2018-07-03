var mongoose = require('mongoose');
var User = mongoose.model('User');
// var uniqueValidator = require('mongoose-unique-validator');

var TaskSchema = new mongoose.Schema({
    title: String,
    order: {type: Number, default: 0},
    priority: {type: Number, default: 0},
    timesPaused: {type: Number, default: 0},
    isActive: {type: Boolean, default: false},
    isComplete: {type: Boolean, default: false},
    wasSuccessful: {type: Boolean, default: false},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: '59fb0738174258442bbd4645'}, // TODO: set by title of 'miscellaneous'
    // project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project'},
    notes: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Note'} ],
    tagList: [ {type: String} ],
    showNotes: {type: Boolean, default: false},
    hideCompletedItems: { type: Boolean, default: true },
    dueDateTime: { type: Date, default: null },
    dueDateTimeNotified: { type: Boolean, default: false },
    reminderDateTime: { type: Date, default: null},
    reminderDateTimeNotified: { type: Boolean, default: false },
    reminderIntervalNumber: { type: Number, default: null },
    reminderIntervalPeriod: { type: String, default: null } // 'hour', 'day', 'week', 'month'
}, {timestamps: true}); // adds createdAt and updatedAt fields

TaskSchema.methods.toJSONFor = function(user) {        
    return {
        id: this.id,
        title: this.title,
        elementType: 'task',
        order: this.order,
        priority: this.priority,
        timesPaused: this.timesPaused,
        isActive: this.isActive,
        isComplete: this.isComplete,
        wasSuccessful: this.wasSuccessful,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        tagList: this.tagList,
        showNotes: this.showNotes,
        hideCompletedItems: this.hideCompletedItems,
        user: this.user.toProfileJSONFor(user), 
        project: this.project ? this.project.toJSON() : null,
        notes: this.notes,
        dueDateTime: this.dueDateTime,
        dueDateTimeNotified: this.dueDateNotified,
        reminderDateTime: this.reminderDateTime,
        reminderDateTimeNotified: this.reminderDateNotified,
        reminderIntervalNumber: this.reminderIntervalNumber,
        reminderIntervalPeriod: this.reminderIntervalPeriod
    };
};

// QUESTION: just return task notification objects with toJSONFor(), so they can be updated as a whole?
//           **ACTUALLY, since we don't look at undefined fields in update route, could just send what we want to update
TaskSchema.methods.toDueDateTimeNotification = function() {
    return {
        id: this.id,
        type: 'due',
        title: this.title,
        targetDateTime: this.dueDateTime,
        notified: this.dueDateTimeNotified,
        user: this.user        
        // dueDateTime: this.dueDateTime,
        // dueDateTimeNotified: this.dueDateTimeNotified
    }
}

TaskSchema.methods.toReminderDateTimeNotification = function() {
    return {
        id: this.id,
        type: 'reminder',
        title: this.title,
        targetDateTime: this.reminderDateTime,
        notified: this.reminderDateTimeNotified,
        reminderIntervalNumber: this.reminderIntervalNumber,
        reminderIntervalPeriod: this.reminderIntervalPeriod,
        user: this.user
        // reminderDateTime: this.reminderDateTime,
        // reminderDateTimeNotified: this.reminderDateTimeNotified
    }
}

mongoose.model('Task', TaskSchema);
