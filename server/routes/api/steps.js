var router = require('express').Router();
var passport = require('passport');
var mongoose = require('mongoose');
var async = require('async')

var User = mongoose.model('User');
var Task = mongoose.model('Task');
var Note = mongoose.model('Note');
var Step = mongoose.model('Step');
var Project = mongoose.model('Project');
var auth = require('../auth');

/* GET step list */
router.get('/', auth.required, function (req, res, next) {
    var query = {};
    var limit = 20;
    var offset = 0;

    if (typeof req.query.id !== 'undefined') {
        query._id = req.query.id;
    }

    if (typeof req.query.title !== 'undefined') {
        query.title = req.query.title;
    }

    if (typeof req.query.stepComplete !== 'undefined') {
        query.stepComplete = req.query.stepComplete === 'true' ? true : false;
    }

    if (typeof req.query.noteID !== 'undefined') {
        query.note = req.query.noteID;
    }

    if (typeof req.query.order !== 'undefined') {
        query.order = req.query.order;
    }

    // TODO: could find Step's corresponding Note and check its user against sent token,
    // TODO(con't): BUT, unnecessary since we already have a unique step ID?
    Step.find(query).sort({ order: 'asc' }).exec().then(function (steps) {  
        return res.json({
            steps: steps.map(function (step) {
                return step.toJSON();
            }),
        });
    }).catch(next);
});

/* POST create step on checklist */
router.post('/', auth.required, function (req, res, next) {
    // TODO/QUESTION: add user authentication here? UNNECESSARY since they'll have to have a valid noteID?
    Note.findById(req.body.step.note).then(function (note) {
        var step = new Step(req.body.step);
        step.note = req.body.step.note;

        // TODO/QUESTION: set step's user?
        return step.save().then(function (step) {
            note.steps.push(step);

            return note.save().then(function () {
                return res.json({ step: step.toJSON() });
            });
        });
    }).catch(next);
});

/* PUT update checklist step */
router.put('/', auth.required, function (req, res, next) {
    Step.findById(req.body.step.id).then(function (targetStep) {
        if (typeof req.body.step.title !== 'undefined') {
            targetStep.title = req.body.step.title;
        }

        if (typeof req.body.step.order !== 'undefined') {
            targetStep.order = req.body.step.order;
        }

        if (typeof req.body.step.stepComplete !== 'undefined') {
            targetStep.stepComplete = req.body.step.stepComplete;
        }

        targetStep.save().then(function (step) {
            return res.json(step.toJSON());
        })
    })
})

/* INTERCEPT and populate step data from id */
router.param('stepId', function(req, res, next, id) {
    Step.findById(id).then(function (step) {
        req.step = step;
        return next();
    }).catch(next);
});
/* DELETE destroy step on note */
router.delete('/:stepId', auth.required, function (req, res, next) {    
    // TODO/QUESTION: add user authentication here? UNNECESSARY since they'll have to have a valid noteID?
  Note.findById(req.step.note).then(function (note) {
      console.log('note A')
      console.log(note)
      note.steps.remove(req.step._id);
      note.save()
        .then(Step.find({ _id: req.step._id }).remove().exec())
        .then(function () {
            console.log('note B')
            console.log(note)
            res.sendStatus(204);
        });
  })  
})

/* PUT increment order of all note steps on step drop event */
router.put('/incrementorder', auth.required, function (req, res, next) {
    let startOrder = req.body.startOrder;
    Step.findById(req.body.tgtStep.id).populate('note').exec().then(function (targetStep) {
        // TODO/QUESTION: add user authentication here? UNNECESSARY since they'll have to have a valid noteID?
        // User.findById(targetStep.task.user).then(function (user) {
            // if (user.id.toString() === req.payload.id.toString()) {
                // Increment step order where order is >= startOrder and step id not equal to the updated step id
                Step.update({ 'order': { $gte: startOrder }, note: targetStep.note._id, _id: { $ne: req.body.tgtStep.id } },
                    { $inc: { 'order': 1 } }, { multi: true })
                    .then(function () {
                        return res.sendStatus(204);
                    })
            // }
        // });
    })
});

module.exports = router;
