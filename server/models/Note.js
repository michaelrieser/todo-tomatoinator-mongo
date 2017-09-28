var mongoose = require('mongoose');

var NoteSchema = new mongoose.Schema({
    title: String,
    isTodo: {type: Boolean, default: false},
    todoComplete: {type: Boolean, default: false},
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' }
}, {timestamps: true});

NoteSchema.methods.toJSON = function(user) {
    return {
        title: this.title,
        isTodo: this.isTodo,
        todoComplete: this.todoComplete,
        task: this.task.toJSONFor(user) // Not sure if this is required (?)
    };
};

mongoose.model('Note', NoteSchema);
