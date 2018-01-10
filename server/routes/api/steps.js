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

/* DELETE destroy note on task */
// router.delete('/:noteId', auth.required, function (req, res, next) {
//     User.findById(req.note.task.user).then(function (user) {
//         if (!user) { return res.sendStatus(401); } // Note: user was NOT authenticated in articles.js POST create comment on article, this was there instead (??)
//         if (user._id.toString() === req.payload.id.toString()) {
//             // must explicitly remove reference to note in Task model
//             //     NOTE: one of the pitfalls of a NoSQL database
//             Task.findById(req.note.task._id).then(function (task) {
//                 task.notes.remove(req.note._id)
//                 task.save()
//                     .then(Note.find({ _id: req.note._id }).remove().exec())
//                     .then(function () {
//                         res.sendStatus(204);
//                     });
//             })
//         } else {
//             res.sendStatus(403);
//         }
//     });
// });

/* POST create note on task */
// router.post('/', auth.required, function (req, res, next) {
//     console.log('note:');
//     console.log(req.body.note);
//     User.findById(req.body.task.user.id).then(function (user) {
//         // if (!user) { return res.sendStatus(401); } // Note: user was NOT authenticated in articles.js POST create comment on article, this was there instead (??)
//         if (req.body.task.user.id.toString() === req.payload.id.toString()) {
//             Task.findById(req.body.task.id).then(function (task) {
//                 var note = new Note(req.body.note);
//                 note.task = req.body.task.id;
//                 // TODO/QUESTION: Set Note's user?        

//                 return note.save().then(function (note) {
//                     task.notes.push(note);

//                     return task.save().then(function () {
//                         return res.json({ note: note.toJSON() })
//                     });
//                 });
//             });

//         }
//     }).catch(next);
// });

module.exports = router;
