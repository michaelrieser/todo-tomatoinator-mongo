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
    notes: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Note'}],
    tagList: [{type: String}],
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
        notes: this.notes
        // user: user.toProfileJSONFor(user) // TODO: find out why this.user is only populating the objectID above (?)
    };
};

mongoose.model('Task', TaskSchema);
