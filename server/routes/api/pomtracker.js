var router = require('express').Router();
// var passport = require('passport');
var mongoose = require('mongoose');
var async = require('async');

var PomTracker = mongoose.model('PomTracker');
// var auth = require('../auth'); // NOTE: assuming that if user has taskId at this point, they have already been authenticated

/* GET pomtracker list */
// @wip

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