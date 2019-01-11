var router = require('express').Router();
// var passport = require('passport');
var mongoose = require('mongoose');
var async = require('async');

var PomTracker = mongoose.model('PomTracker');
var auth = require('../auth'); 
// var moment = require('moment');
var moment = require('moment-timezone');

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
    var queryTimezone = req.query.timezone;

    var queryMomentStart;
    var queryMomentEnd;

    if (queryType === 'daily') {
        queryMomentStart = moment().tz(queryTimezone).startOf('day');
        queryMomentEnd = moment().tz(queryTimezone).endOf('day');
        if (queryOffset) {
            queryMomentStart = queryMomentStart.add(queryOffset, 'days');
            queryMomentEnd   = queryMomentEnd.add(queryOffset, 'days');
        }
    // TODO: set as business week!? || OR add option on front end?
    } else if (queryType === 'weekly') {
        queryMomentStart = moment().tz(queryTimezone).startOf('day').subtract(6, 'days'); // NOTE: 1 week adds addtional day
        queryMomentEnd = moment().tz(queryTimezone).endOf('day');
        if (queryOffset) {
            queryMomentStart = queryMomentStart.add(queryOffset, 'weeks');
            queryMomentEnd   = queryMomentEnd.add(queryOffset, 'weeks');
        }
    } else if (queryType === 'monthly') {        
        // NOTE: subtracting 1 'month' places moment today's day in prior month (ex: Jan 7 => Dec 7), this would result 
        //       in over 28 days being subtracted (for certain months) and the moment being set one week too far back
        //       *INSTEAD:
        //                - subtract 21 days(3 weeks) to get corresponding day of start week
        //                - if today is NOT Monday, set queryMomentStart to Monday of start week
        //                - then add 27 days to set queryMomentEnd
        queryMomentStart = moment().tz(queryTimezone).startOf('day').subtract(21, 'days');    
        if (queryMomentStart.day() !== 1) { queryMomentStart = queryMomentStart.isoWeekday(1); }
        queryMomentEnd = queryMomentStart.clone().add(27, 'days');
        if (queryOffset) {
            let offsetDays = queryOffset * 28;            
            queryMomentStart = queryMomentStart.add(offsetDays, 'days');
            queryMomentEnd   = queryMomentEnd.add(offsetDays, 'days');
        }
    } else {
        // TODO: throw error || return 500 with explicit msg?
    }
    query.user = req.payload.id.toString();
    query.updatedAt = { $gte: queryMomentStart, $lte: queryMomentEnd };

    PomTracker.find(query).sort({ updatedAt: 'asc'}).populate({
            path: 'task', 
            select: 'title project dueDateTime',
            populate: {
                path: 'project',
                select: 'title'
            }
    }).exec().then(function (pomtrackers) {
        return res.json({
            pomtrackers: pomtrackers.map(function (pomtracker) {            
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