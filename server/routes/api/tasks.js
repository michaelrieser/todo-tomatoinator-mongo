var router = require('express').Router();
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Task = mongoose.model('Task');
var Note = mongoose.model('Note');
// var Tag = mongoose.model('Tag'); // @wip

// TODO: Once user auth functionality in place, implement saving articles based off of user
//  SEE: file:///C:/Projects/Angular_Workspace/1/Thinkster_Full_Stack/Backend_Node/07_creating_crud_endpoints_for_articles.htm - Utilizing router parameters
// router.post('/', auth.required, function(req, res, next) {
//   User.findById(req.payload.id).then(function(user){
//     if (!user) { return res.sendStatus(401); }

//     var task = new Task(req.body.task);

//     task.author = user;

//     return task.save().then(function(){
//     return res.json({task: task.toJSONFor(user)});
//      //return res.json({article: article.toJSONFor(user)});
//     });
//   }).catch(next);
// });

module.exports = router;
