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
router.post('/', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if (!user) { return res.sendStatus(401); }

    var project = new Project(req.body.project);

    project.user = user;

    // TODO: Add project to user model as well ?
    return project.save().then(function(project){
        // return res.json({task: task.toJSON});
        return res.json({project: project.toJSON()});
    });
  }).catch(next);
});

/* GET all projects */
router.get('/', auth.optional, function(req, res, next) {
  var query = {};
  var limit = 20;
  var offset = 0;

  User.findById(req.payload.id).then(function(user) {

    var userId = user._id;
    query.user = userId;

    Project.find(query).then(function(projects) {
      return res.json({
        projects: projects.map(function(project) {
          return project.toJSON();
        })
      })
    }).catch(next);
  })

});

module.exports = router;