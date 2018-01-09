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

/* INTERCEPT and prepopulate user data */
router.param('tasks', function (req, res, next) {
    // Article.findOne({ slug: slug })
    //     .populate('author')
    //     .then(function (article) {
    //         if (!article) { return res.sendStatus(404); }
    //         req.article = article;
    //         return next();
    //     }).catch(next);
});

/* POST create task */
router.post('/', auth.required, function (req, res, next) {
    User.findById(req.payload.id).then(function (user) {
        if (!user) { return res.sendStatus(401); }
        var task = new Task(req.body.task);
        task.user = user;
        task.project = req.body.task.project.id;

        return task.save().then(function (task) {
            task.populate('project').execPopulate().then(function () {

                task.project.tasks.push(task);

                return task.project.save().then(function () {
                    return res.json({ task: task.toJSONFor(user) });
                })
            });
        });
    }).catch(next);
});

/* GET task list */
router.get('/', auth.optional, function (req, res, next) {
    var query = {};
    var limit = 20;
    var offset = 0;

    User.findById(req.payload.id).then(function (user) {
        /* Kept for reference - see: file:///C:/Projects/Angular_Workspace/1/Thinkster_Full_Stack/Backend_Node/12_creating_queryable_endpoints_for_lists_and_feeds.htm - 'Create an endpoint to list articles'
        if(typeof req.query.limit !== 'undefined'){
          limit = req.query.limit;
        }
    
        if(typeof req.query.offset !== 'undefined'){
          offset = req.query.offset;
        }
        */
        if (typeof req.query.isComplete !== 'undefined') {
            query.isComplete = req.query.isComplete === 'true' ? true : false;
        }

        if (typeof req.query.tag !== 'undefined') {
            query.tagList = { "$in": [req.query.tag] };
        }

        if (typeof req.query.title !== 'undefined') {
            query.title = req.query.title;
        }

        if (typeof req.query.id !== 'undefined') {
            query.id = req.query.id;
        }

        if (typeof req.query.order !== 'undefined') {
            query.order = req.query.order;
        }

        // NOTE: initially attempted to add project to query here, but query only takes ObjectIDs. Used Promise instead
        // if (typeof req.query.project !== 'undefined') {
        //   console.log('project NOT undefined');
        //   query.project = req.query.project;
        //   // query.project = {"$in": [req.query.project]};
        // }

        var userId = user._id;
        query.user = userId;

        // Find project if query included project
        return Promise.all([
            req.query.project ? Project.findOne({ title: req.query.project }) : null
        ]).then(function (results) {
            var project = results[0];

            if (project) {
                query.project = project._id;
            }

            return Promise.all([
                // *queried tasks*
                Task.find(query)
                    .populate('user')
                    .populate({ path: 'notes', options: { sort: { order: 'asc' } } })
                    .populate('project')
                    // .limit(Number(limit))
                    // .skip(Number(offset))
                    .sort({ isComplete: 1, order: 'asc' })
                    .exec(),
                // *tasksCount*
                Task.count(query).exec(),
                // *allTasks*
                Task.find({ user: userId })
                    .populate('user') // TODO: instead of populating user (again), just add another method (toJSON) to Task model?
                    .populate('notes') // TODO: instead of populating notes for all tasks, just populate for activeTask below (if found)
                    .sort({ order: -1 })
            ]).then(function (results) {
                // TODO: for performance, could get all tasks then sort by filters here... comida por pensamiento

                var tasks = results[0];
                var tasksCount = results[1];
                var allTasks = results[2];
                var allTasksLength = allTasks.length;

                var activeTask = allTasks.find((task) => { return task.isActive; });
                if (activeTask) { activeTask = activeTask.toJSONFor(user) };

                var highestOrderNumber = 0;
                var lowestOrderNumber = 0;

                if (allTasksLength > 0) {
                    // .slice() makes a copy of the tasks object, in JS .sort() is destructive and this was breaking desired task order w/o .slice()
                    // highestOrderNumber = tasks.slice().sort((a,b) => a.order - b.order)[allTasksLength-1].order;       
                    lowestOrderNumber = allTasks[allTasksLength - 1].order;
                    highestOrderNumber = allTasks[0].order;
                }

                return res.json({
                    tasks: tasks.map(function (task) {
                        // task.populate({path: 'notes'}).execPopulate().then((t) => console.log(t));
                        // console.log(`task: ${task}`);
                        return task.toJSONFor(user);
                    }),
                    tasksCount: tasksCount,
                    lowestOrderNumber: lowestOrderNumber,
                    highestOrderNumber: highestOrderNumber,
                    activeTask: activeTask
                });
            }).catch(next);
        })
    })
});

/* PUT update task */
router.put('/update', auth.required, function (req, res, next) {
    User.findById(req.payload.id).then(function (user) {
        if (req.body.task.user.id.toString() === req.payload.id.toString()) {

            Task.findById(req.body.task.id).populate('user').then(function (targetTask) {

                if (typeof req.body.task.title !== 'undefined') {
                    targetTask.title = req.body.task.title;
                }

                if (typeof req.body.task.order !== 'undefined') {
                    targetTask.order = req.body.task.order;
                }

                if (typeof req.body.task.priority !== 'undefined') {
                    targetTask.priority = req.body.task.priority;
                }

                // TODO: not sure if this should go here?
                // if(typeof req.body.task.timesPaused !== 'undefined'){
                //     targetTask.timesPaused = req.body.task.timesPaused;
                // }

                if (typeof req.body.task.timesPaused !== 'undefined') {
                    targetTask.timesPaused = req.body.task.timesPaused;
                }

                if (typeof req.body.task.isActive !== 'undefined') {
                    targetTask.isActive = req.body.task.isActive;
                }

                if (typeof req.body.task.isComplete !== 'undefined') {
                    targetTask.isComplete = req.body.task.isComplete;
                }

                if (typeof req.body.task.wasSuccessful !== 'undefined') {
                    targetTask.wasSuccessful = req.body.task.wasSuccessful;
                }

                if (typeof req.body.task.showNotes !== 'undefined') {
                    targetTask.showNotes = req.body.task.showNotes;
                }

                /* Note: placeholders for (potential) future fields */
                // if(typeof req.body.task.isComplete !== 'undefined'){
                //     targetTask.isComplete = req.body.task.isComplete;
                // }                       

                return targetTask.save().then(function (task) {
                    return res.json({ task: targetTask.toJSONFor(user) });
                }).catch(next)
            });


        }
    });
});

/* PUT increment order of all tasks on task drop event */
router.put('/incrementorder', auth.required, function (req, res, next) {
    let startOrder = req.body.startOrder;
    User.findById(req.payload.id).then(function (user) {
        if (req.body.tgtTask.user.id.toString() === req.payload.id.toString()) {
            // Increment task order where order is >= startOrder and task id not equal to the updated task id
            Task.update({ 'order': { $gte: startOrder }, _id: { $ne: req.body.tgtTask.id } },
                { $inc: { 'order': 1 } }, { multi: true })
                .then(function (tasks) {
                    return res.sendStatus(204);
                })
        }
    });
});

/* INTERCEPT and prepopulate task data from id */
// TODO: REFACTOR other routes to utilize this interceptor //
router.param('taskId', function (req, res, next, id) {
    Task.findById(id)
        .populate('user')
        // .populate('project')
        // .populate('notes')
        .then(function (task) {
            if (!task) { return res.sendStatus(404); }
            req.task = task;
            return next();
        }).catch(next);
});

/* DELETE task */
router.delete('/:taskId', auth.required, function (req, res, next) {
    User.findById(req.task.id).then(function (user) {
        if (req.task.user.id.toString() === req.payload.id.toString()) {
            // must explicitly remove reference to Task in Project model
            //      NOTE: one of the pitfalls of a NoSQL database                
            Project.findById(req.task.project).then(function (project) {
                project.tasks.remove(req.task._id)
                project.save()
                    .then(Task.find({ _id: req.task._id }).remove().exec())
                    .then(function () {
                        return res.sendStatus(204);
                    })
            });
        } else {
            return res.sendStatus(403);
        }
    });
});

// ------- NOTE routes -------
/* GET note list */
router.get('/notes', auth.required, function (req, res, next) {
    console.log('GET /notes');

    var query = {};
    var limit = 20;
    var offset = 0;

    if (typeof req.query.todoComplete !== 'undefined') {
        query.todoComplete = req.query.todoComplete === 'true' ? true : false;
    }

    if (typeof req.query.tag !== 'undefined') {
        query.tagList = { "$in": [req.query.tag] };
    }

    if (typeof req.query.title !== 'undefined') {
        query.title = req.query.title;
    }

    if (typeof req.query.id !== 'undefined') {
        query.id = req.query.id;
    }

    if (typeof req.query.taskID !== 'undefined') {
        query.task = req.query.taskID;
    }

    if (typeof req.query.order !== 'undefined') {
        query.order = req.query.order;
    }

    // TODO: could find Note's corresponding Task and check its user against sent token,
    // TODO(con't): BUT, unnecessary since we already have a unique task ID?
    Note.find(query).sort({ order: 'asc' }).exec().then(function (notes) {                
        return res.json({
            notes: notes.map(function (note) {
                return note.toJSON();
            }),
        });
    }).catch(next);
});

/* POST create note on task */
router.post('/notes', auth.required, function (req, res, next) {
    User.findById(req.body.task.user.id).then(function (user) {
        // if (!user) { return res.sendStatus(401); } // Note: user was NOT authenticated in articles.js POST create comment on article, this was there instead (??)
        if (req.body.task.user.id.toString() === req.payload.id.toString()) {
            Task.findById(req.body.task.id).then(function (task) {
                var note = new Note(req.body.note);
                note.task = req.body.task.id;
                // TODO/QUESTION: Set Note's user?        

                return note.save().then(function (note) {
                    task.notes.push(note);

                    return task.save().then(function () {
                        return res.json({ note: note.toJSON() })
                    });
                });
            });

        }
    }).catch(next);
});

/* INTERCEPT and prepopulate note data from id */
router.param('noteId', function (req, res, next, id) {
    Note.findById(id)
        // .populate('user')
        .populate('task')
        .populate('user')
        .then(function (note) {
            if (!note) { return res.sendStatus(404); }
            req.note = note;
            return next();
        }).catch(next);
});
/* DELETE destroy note on task */
router.delete('/notes/:noteId', auth.required, function (req, res, next) {
    User.findById(req.note.task.user).then(function (user) {
        if (!user) { return res.sendStatus(401); } // Note: user was NOT authenticated in articles.js POST create comment on article, this was there instead (??)
        if (user._id.toString() === req.payload.id.toString()) {
            // must explicitly remove reference to note in Task model
            //     NOTE: one of the pitfalls of a NoSQL database
            Task.findById(req.note.task._id).then(function (task) {
                task.notes.remove(req.note._id)
                task.save()
                    .then(Note.find({ _id: req.note._id }).remove().exec())
                    .then(function () {
                        res.sendStatus(204);
                    });
            })
        } else {
            res.sendStatus(403);
        }
    });
});

/* PUT update task note */
router.put('/notes', auth.required, function (req, res, next) {
    // TODO: populate some task data (taskID) in notes instead of just ID ?
    Task.findById(req.body.note.task).then(function (task) {
        User.findById(task.user).then(function (user) {
            if (!user) { return res.sendStatus(401); } // Note: user was NOT authenticated in articles.js POST create comment on article, this was there instead (??)
            if (user._id.toString() === req.payload.id.toString()) {
                Note.findById(req.body.note.id).then(function (targetNote) {

                    if (typeof req.body.note.todoComplete !== 'undefined') {
                        targetNote.todoComplete = req.body.todoComplete;
                    }

                    if (typeof req.body.note.order !== 'undefined') {
                        targetNote.order = req.body.note.order;
                    }

                    targetNote.save().then(function (note) {
                        // res.json({todoComplete: note.todoComplete})
                        return res.json(note.toJSON());
                    })
                })
            } else {
                res.sendStatus(403);
            }
        });
    })
})

/* PUT increment order of all task notes on task note drop event */
router.put('/notes/incrementorder', auth.required, function (req, res, next) {
    console.log('/notes/incrementorder');
    console.log(req.body);
    let startOrder = req.body.startOrder;
    Note.findById(req.body.tgtNote.id).populate('task').exec().then(function (targetNote) {
        User.findById(targetNote.task.user).then(function (user) {
            if (user.id.toString() === req.payload.id.toString()) {
                // TODO: Increment note order where order is >= startOrder and note id not equal to the updated note id
                Note.update({ 'order': { $gte: startOrder }, task: targetNote.task._id, _id: { $ne: req.body.tgtNote.id } },
                    { $inc: { 'order': 1 } }, { multi: true })
                    .then(function () {
                        return res.sendStatus(204);
                    })
            }
        });
    })
});


module.exports = router;