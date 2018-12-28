var router = require('express').Router();
// var passport = require('passport');
var mongoose = require('mongoose');
var async = require('async');

var PomTracker = mongoose.model('PomTracker');
var auth = require('../auth'); 
var moment = require('moment');

/* GET pomtracker list */
router.get('/', auth.required, function (req, res, next) {
    console.log('GET /pomtracker')
    // NOTE: left for testing monthly when implemented
    // console.log('GET /pomtracker');
    // console.log('req.query: ', req.query); // START => return values from given user based on { type: 'daily' }
    // console.log('USER - req.payload.id: ', req.payload.id.toString());    

    var query = {};
    var queryOffset = parseInt(req.query.offset); // Integer || NaN (falsy)
    var queryType = req.query.type;

    var queryMomentStart;
    var queryMomentEnd   = moment().endOf('day');

    if (queryType === 'daily') {
        queryMomentStart = moment().startOf('day');
        if (queryOffset) {
            queryMomentStart = queryMomentStart.add(queryOffset, 'days');
            queryMomentEnd   = queryMomentEnd.add(queryOffset, 'days');
        }
    // TODO: set as business week!? || OR add option on front end?
    } else if (queryType === 'weekly') {
        queryMomentStart = moment().startOf('day').subtract('6', 'days'); // NOTE: 1 week adds addtional day
        if (queryOffset) {
            queryMomentStart = queryMomentStart.add(queryOffset, 'weeks');
            queryMomentEnd   = queryMomentEnd.add(queryOffset, 'weeks');
        }
    } else if (queryType === 'monthly') {
        // TODO: set queryMomentStart to moment.startOf('day) - ~30(set based on month?);
    } else {
        // TODO: throw error || return 500 with explicit msg?
    }
    // NOTE: left for testing monthly when implemented
    // console.log('queryMomentStart: ', queryMomentStart.format('MMMM Do YYYY, h:mm:ss a'));
    // console.log('queryMomentEnd: ', queryMomentEnd.format('MMMM Do YYYY, h:mm:ss a'));
    query.user = req.payload.id.toString();
    query.updatedAt = { $gte: queryMomentStart, $lt: queryMomentEnd };

    console.log('query:')
    console.log(query);

    PomTracker.find(query).sort({ updatedAt: 'asc'}).populate({
            path: 'task', 
            select: 'title project dueDateTime',
            populate: {
                path: 'project',
                select: 'title'
            }
    }).exec().then(function (pomtrackers) {
        console.log('pomtrackers:')
        console.log(pomtrackers)
        return res.json({
            pomtrackers: pomtrackers.map(function (pomtracker) {
                // console.log(pomtracker.toJSON());
                return pomtracker.toJSON();
            }),
            queryStartISO: queryMomentStart.toISOString(),
            queryEndISO: queryMomentEnd.toISOString()            
        });
    }).catch(next);    
});

/* POST create new pomtracker record */
router.post('/', function (req, res, next) {
    // TODO/QUESTION: could potentially look at user id and compare to passport payload id?
    var newPomTracker = new PomTracker(req.body.pomTracker);    
    return newPomTracker.save().then(function (newPomTracker) {
        return res.json({ pomTracker: newPomTracker.toJSON() });
    })
});


/* PUT add minute to PomTracker record */
router.put('/logpomminute', function (req, res, next) {
    let pomTrackerId = req.body.pomTrackerId;
    PomTracker.update({ _id: pomTrackerId },  { $inc: { 'minutesElapsed': 1 } })
        .then(function (updatedPomTracker) {
            return res.sendStatus(204);
        })        
});

/* PUT increment times PomTracker record paused */
/* *** TODO/NOTE: not yet tested!!!!!! *** */
router.put('/incrementpause', function (req, res, next) {
    let pomTrackerId = req.body.pomTrackerId;
    PomTracker.update({ _id: pomTrackerId },  { $inc: { 'timesPaused': 1 } })
        .then(function (updatedPomTracker) {
            return res.sendStatus(204);
        })        
});

/* PUT update PomTracker interval */
router.put('/', function (req, res, next) {    
    let reqPomTracker = req.body.pomTracker;
    PomTracker.findById(reqPomTracker.id).then(function (tgtPomTracker) {        
        if (typeof reqPomTracker.intervalSuccessful !== 'undefined') {
            tgtPomTracker.intervalSuccessful = reqPomTracker.intervalSuccessful;
            tgtPomTracker.closed = true;
            tgtPomTracker.closedTime = new Date(); // NOTE: want to set closedTime regardless of pom success
        }

        tgtPomTracker.save().then(function (pomTracker) {
            return res.json(pomTracker.toJSON());
        })
    })
})

/* GET aggregate total time (minutesElapsed) spent on given task */
router.get('/taskinfo', function (req, res, next) {   
    let targetTaskID = req.query.taskID;
    PomTracker.find({"task": mongoose.Types.ObjectId(targetTaskID) }).then(function (pomtrackers) {
        let minutesElapsed = pomtrackers.reduce( function(sum, p) {
            return sum + p.minutesElapsed;
        }, 0);
        return res.json({
            minutesElapsed: minutesElapsed
        })
    }).catch(next);
});

module.exports = router;