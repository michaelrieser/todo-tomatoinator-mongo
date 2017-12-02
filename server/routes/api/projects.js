var router = require('express').Router();
var passport = require('passport');
var mongoose = require('mongoose');
var async = require('async')

var User = mongoose.model('User');
var Task = mongoose.model('Task');
var Note = mongoose.model('Note');
var Project = mongoose.model('Project');

var auth = require('../auth');
// var Tag = mongoose.model('Tag'); // @wip

/* POST create project */
router.post('/', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (!user) { return res.sendStatus(401); }

    var project = new Project(req.body.project);

    project.user = user;

    // TODO: Add project to user model as well ?
    return project.save().then(function (project) {
      // return res.json({task: task.toJSON});
      return res.json({ project: project.toJSON() });
    });
  }).catch(next);
});

/* GET all projects */
router.get('/', auth.optional, function (req, res, next) {
  var query = {};
  var limit = 20;
  var offset = 0;

  User.findById(req.payload.id).then(function (user) {

    var userId = user._id;
    query.user = userId;

    Project.find(query).then(function (projects) {
      return res.json({
        projects: projects.map(function (project) {
          return project.toJSON();
        })
      })
    }).catch(next);
  })

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
    //     model: 'Note'
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

      // SEE: https://stackoverflow.com/questions/30044792/mongodb-how-to-find-a-document-by-an-id-inside-a-nested-document
      Note.find({"task": "5a1324ba3a6cf8b4307f2895"}).then(function(notes){ // WORKS!!!!!!!!!!!!!!!!!!! :)
        console.log('B')
        console.log(notes);
      })
      console.log('C')
      // req.project.tasks.each
      // Aggregate list of task ids
      // Delete notes from each task id => EXAMPLE: UTUSTP.remove({_id: {$in: wronglist}}, function(){...}); // and so on
      // Delete task
      // Delete Project

      //       // must explicitly remove reference to Task in Project model
      //       //      NOTE: one of the pitfalls of a NoSQL database                
      //       Project.findById(req.task.project).then(function(project) {
      //           project.tasks.remove(req.task._id)
      //           project.save()
      //             .then(Task.find({_id: req.task._id}).remove().exec())
      //             .then(function() {
      //               return res.sendStatus(204);
      //             })                        
      //       });          
      //     } else {
      //       return res.sendStatus(403);
      //     }
    };
  });
});

module.exports = router;