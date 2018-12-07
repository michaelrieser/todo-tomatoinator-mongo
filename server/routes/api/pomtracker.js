var router = require('express').Router();
// var passport = require('passport');
var mongoose = require('mongoose');
var async = require('async');

var PomTracker = mongoose.model('PomTracker');
var auth = require('../auth'); 
var moment = require('moment');

/* GET pomtracker list */
router.get('/', auth.required, function (req, res, next) {
    console.log('GET /pomtracker');
    console.log('req.query: ', req.query); // START => return values from given user based on { type: 'daily' }
    console.log('USER - req.payload.id: ', req.payload.id.toString());    

    var query = {};
    // var limit = 20;
    // var offset = 0;

    // ** type: 'daily' **
    // TDOO: add conditional for 'daily' || 'weekly' || 'monthly' || etc..
    var todayStart = moment().startOf('day');
    var todayEnd   = moment().endOf('day');

    query.user = req.payload.id.toString();
    query.updatedAt = { $gte: todayStart, $lt: todayEnd };

    PomTracker.find(query).sort({ updatedAt: 'asc'}).populate('task', 'title project dueDateTime').exec().then(function (pomtrackers) {
        console.log('** pomtrackers: ')
        console.log(pomtrackers)
        return res.json({
            pomtrackers: pomtrackers.map(function (pomtracker) {
                return pomtracker.toJSON();
            }),
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
    console.log('PUT /pomtracker')
    let reqPomTracker = req.body.pomTracker;
    PomTracker.findById(reqPomTracker.id).then(function (tgtPomTracker) {        
        if (typeof reqPomTracker.intervalSuccessful !== 'undefined') {
            tgtPomTracker.intervalSuccessful = reqPomTracker.intervalSuccessful;
            tgtPomTracker.closed = true;
            tgtPomTracker.closedTime = new Date(); // NOTE: want to set closedTime regardless of pom success
            // if (tgtPomTracker.intervalSuccessful) {
            //     tgtPomTracker.completedTime = new Date();
            // }
        }

        tgtPomTracker.save().then(function (pomTracker) {
            return res.json(pomTracker.toJSON());
        })
    })
})

module.exports = router;