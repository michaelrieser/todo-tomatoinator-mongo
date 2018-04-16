var mongoose = require('mongoose');
// var User = mongoose.model('User');
var uniqueValidator = require('mongoose-unique-validator');

var ProjectSchema = new mongoose.Schema({
    title: {type: String, unique: true, required: [true, "can't be blank"], index: true},
    order: { type: Number, default: 0 },
    tasks: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Task'} ], // TODO: unsure if needed
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    notes: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Note'} ],
    // dueDate: ?, /* TODO: allow user to set due date for project, potentially w/reminders */
    // users: ? /* TODO: allow the tracking of all users on an individual project */
}, {timestamps: true}); // adds createdAt and updatedAt fields

ProjectSchema.plugin(uniqueValidator, { message: 'is already taken.'});

ProjectSchema.methods.toJSON = function() {     
    return {
        id: this.id,
        order: this.order,
        title: this.title,
        // tasks: this.tasks, // TODO: unsure if needed
        user: this.user,
        // user: this.user.toProfileJSONFor(user), // NOTE/TODO: hangs - unsure if even necessary!!
        notes: this.notes
    };
};

mongoose.model('Project', ProjectSchema);
