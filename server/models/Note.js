var mongoose = require('mongoose');

var NoteSchema = new mongoose.Schema({
    title: String,
    isTodo: {type: Boolean, default: false},
    // steps: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Step'} ], // TODO: uncomment once Step model created
    todoComplete: {type: Boolean, default: false},
    tagList: [{type: String}],
    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}, // Question: since Note references Task and Task references User, do we need to directly reference User from Note (?)
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task'} 
}, {timestamps: true});

NoteSchema.methods.toJSON = function() {
    return {
        id: this._id,
        title: this.title,
        isTodo: this.isTodo,
        todoComplete: this.todoComplete,
        // task: this.task.toJSONFor(task.user) // Not sure if this is required (?)
        taskID: this.task.ObjectId
    };
};

mongoose.model('Note', NoteSchema);
