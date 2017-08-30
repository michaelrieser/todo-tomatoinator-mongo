var router = require('express').Router();
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Task = mongoose.model('Task');
var Note = mongoose.model('Note');
var auth = require('../auth');
// var Tag = mongoose.model('Tag'); // @wip

/* POST create task */
// TODO: Once user auth functionality in place, implement saving articles based off of user
//  SEE: file:///C:/Projects/Angular_Workspace/1/Thinkster_Full_Stack/Backend_Node/07_creating_crud_endpoints_for_articles.htm - Utilizing router parameters
router.post('/', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if (!user) { return res.sendStatus(401); }

    var task = new Task(req.body.task);

    task.user = user;

    return task.save().then(function(){
        console.log(task.user);
        return res.json({task: task.toJSON});
     //return res.json({article: article.toJSONFor(user)});
    });
  }).catch(next);
});

module.exports = router;

/* GET task list */
router.get('/', auth.optional, function(req, res, next) {
  var query = {};
  var limit = 20;
  var offset = 0;
  /* Kept for reference - see: file:///C:/Projects/Angular_Workspace/1/Thinkster_Full_Stack/Backend_Node/12_creating_queryable_endpoints_for_lists_and_feeds.htm - 'Create an endpoint to list articles'
  if(typeof req.query.limit !== 'undefined'){
    limit = req.query.limit;
  }

  if(typeof req.query.offset !== 'undefined'){
    offset = req.query.offset;
  }
  */
  if (typeof req.query.tag !== 'undefined') {
    query.tagList = {"$in": [req.query.tag]};
  }

  return Promise.all([
    // *tasks*
    Task.find(query)
      // .limit(Number(limit))
      // .skip(Number(offset))
      .sort({order: 'asc'})
      // .populate('author')
      .exec(),
    // *tasksCount*
    Task.count(query).exec()
    // *user*
    // req.payload ? User.findById(req.payload.id) : null, // not needed since we already know user
  ]).then(function(results){
    var tasks = results[0];
    var tasksCount = results[1];    
    var tasksLength = tasks.length
    var highestOrderNumber = results[0][tasksLength-1].order        

    return res.json({
      tasks: tasks.map(function(task){
        // return task.toJSONFor(user); // not needed since we already know user
        return task.toJSON();
      }),
      tasksCount: tasksCount,
      highestOrderNumber: highestOrderNumber
    });
  }).catch(next);
});
