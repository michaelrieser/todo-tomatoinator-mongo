var mongoose = require('mongoose');

var StepSchema = new mongoose.Schema({
    title: String,
    order: {type: Number, default: 0},
    stepComplete: {type: Boolean, default: false},
    note: { type: mongoose.Schema.Types.ObjectId, ref: 'Note' }
}, {timestamps: true});

StepSchema.methods.toJSON = function() {
    return {
        id: this._id,
        title: this.title,
        order: this.order,
        stepComplete: this.stepComplete,
        note: this.note
    };
};

mongoose.model('Step', StepSchema);
