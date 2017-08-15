var mongoose = require('mongoose');

var NoteSchema = new mongoose.Schema({
    title: String,
    isTodo: {type: Boolean, default: false},
    todoComplete: {type: Boolean, default: false},
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' }
}, {timestamps: true});

NoteSchema.methods.toJSON = function() {
    return {
        title: this.title,
        isTodo: this.isTodo,
        todoComplete: this.todoComplete,
        task: this.task.toJSON()
    };
};

mongoose.model('Note', NoteSchema);
