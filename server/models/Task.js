var mongoose = require('mongoose');
// var uniqueValidator = require('mongoose-unique-validator');

var TaskSchema = new mongoose.Schema({
    title: String,
    order: {type: Number, default: 0},
    priority: {type: Number, default: 0},
    timesPaused: {type: Number, default: 0},
    isActive: {type: Boolean, default: false},
    isComplete: {type: Boolean, default: false},
    wasSuccessful: {type: Boolean, default: false},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {timestamps: true}); // adds createdAt and updatedAt fields

// TaskSchema.methods.toJSONFor = function(user) {
TaskSchema.methods.toJSON = function() {
    return {
        title: this.title,
        order: this.order,
        priority: this.priority,
        timesPaused: this.timesPaused,
        isActive: this.isActive,
        isComplete: this.isComplete,
        wasSuccessful: this.wasSuccessful,
        // user: this.user.toProfileJSONFor(user)
    };
};

mongoose.model('Task', TaskSchema);
