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
// var Tag = mongoose.model('Tag'); // @wip

/* POST create project */
router.post('/', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (!user) { return res.sendStatus(401); }

    var project = new Project(req.body.project);    

    project.user = user._id;

    // TODO: Add project to user model as well ?
    return project.save().then(function (project) {
      return res.json({ project: project.toJSON() });
    });
  }).catch(next);
});

/* GET all projects */
router.get('/', auth.required, function (req, res, next) {
  var query = {};
  var limit = 20;
  var offset = 0;

  User.findById(req.payload.id).then(function (user) {
    var userId = user._id;
    query.user = userId;

    if (typeof req.query.order !== 'undefined') {
      query.order = req.query.order;
    }

    return Promise.all([
      // *queried projects*     
      Project.find(query).sort({ 'order': 1 }),
      // *lowestOrderNumber*
      Project.find({}).sort({ 'order': 1 }).limit(1),
      // *highestOrderNumber*
      Project.find({}).sort({ 'order': -1 }).limit(1)
    ]).then(function (results) {
      let queriedProjects    = results[0];
      let lowestOrderNumber  = results[1][0].order;
      let highestOrderNumber = results[2][0].order;

      let mappedQueriedProjects = queriedProjects.map(function (project) {
        return project.toJSON();
      });

      return res.json({
        projects: mappedQueriedProjects,
        lowestOrderNumber: lowestOrderNumber,
        highestOrderNumber: highestOrderNumber
      })
    }).catch(next);
  })  
});

/* PUT update project */
router.put('/update', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (req.body.project.user.toString() === req.payload.id.toString()) {

      Project.findById(req.body.project.id).then(function (targetProject) {
        
        if (typeof req.body.project.title !== 'undefined') {
          targetProject.title = req.body.project.title;
        }

        if (typeof req.body.project.order !== 'undefined') {
          targetProject.order = req.body.project.order;
        }

        return targetProject.save().then(function () {
          return res.json({ project: targetProject.toJSON() })
        }).catch(next)
      })
    }
  })
})

/* PUT increment order of all projects on project drop event */
router.put('/incrementorder', auth.required, function (req, res, next) {  
  let startOrder = req.body.startOrder;
  User.findById(req.payload.id).then(function (user) {    
    if (req.body.tgtProject.user.toString() === req.payload.id.toString()) {
      // Increment project order where order is >= startOrder and project id not equal to the updated task id
      Project.update({ 'order': { $gte: startOrder }, _id: { $ne: req.body.tgtProject.id } },
        { $inc: { 'order': 1 } }, { multi: true })
        .then(function (projects) {
          return res.sendStatus(204);
        })
    }
  });
});

/* INTERCEPT and prepopulate project data from id */
router.param('projectId', function (req, res, next, id) {
  Project.findById(id)
    .populate('user')
    .populate('tasks')
    // .populate({ // TODO: *NOT WORKING* need to upgrade MongoDB from 3.4.7 to >= 4.5 for nested populates. SEE: https://stackoverflow.com/questions/19222520/populate-nested-array-in-mongoose
    //   path: 'tasks',
    //   populate: {
    //     path: 'notes',
    //     model: 'Note',
    //     populate: {
    //       path: 'steps',
    //       model: 'Step'
    //     }
    //   }
    // }) 
    .then(function (project) {
      if (!project) { return res.sendStatus(404); }
      req.project = project;
      return next();
    }).catch(next);
});

/* DELETE project */
router.delete('/:projectId', auth.required, function (req, res, next) {
  //   TODO: following from Tasks DELETE, update for Project
  //   TODO: delete associated tasks & tasks' notes
  User.findById(req.project.user.id).then(function (user) {

    if (req.project.user.id.toString() === req.payload.id.toString()) {

      // Aggregate list of task ids
      var projectTaskIds = req.project.tasks.map((t) => { return t._id });

      Note.find({ "task": { $in: projectTaskIds } }, { _id: 1 }).then(function (notes) {
        let noteIds = notes.map((n) => { return n._id });
        Step.find({ "note": { $in: noteIds } }).remove().exec().then(function () {
          // Delete notes from each task id => EXAMPLE: <Collection>.remove({_id: {$in: wronglist}}, function(){...}); // and so on
          Note.find({ _id: { $in: noteIds } }).remove().exec().then(function (notes) {
            // Delete tasks        
            Task.find({ _id: { $in: projectTaskIds } }).remove().exec().then(function () {
              Project.find({ _id: req.project._id }).remove().exec().then(function () {
                return res.sendStatus(204);
              })
            })
          })
        })
      })
    } else {
      return res.sendStats(403);
    }
  });
});

module.exports = router;