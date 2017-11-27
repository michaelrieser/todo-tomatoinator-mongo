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
    showNotes: {type: Boolean, default: false}
}, {timestamps: true}); // adds createdAt and updatedAt fields

TaskSchema.methods.toJSONFor = function(user) {        
    return {
        id: this.id,
        title: this.title,
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
        user: this.user.toProfileJSONFor(user), 
        // project: this.project.toJSONFor(user),
        project: this.project.toJSON(),
        notes: this.notes
    };
};

mongoose.model('Task', TaskSchema);
