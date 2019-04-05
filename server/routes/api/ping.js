var router = require('express').Router();
var auth = require('../auth');

/* GET ping server to wakeup app */
router.get('/', auth.optional, function (req, res, next) {
    res.sendStatus(200);
});

module.exports = router;