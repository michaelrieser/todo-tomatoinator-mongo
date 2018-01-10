var router = require('express').Router();
router.use('/', require('./users'));
router.use('/projects', require('./projects'));
router.use('/tasks', require('./tasks'));
router.use('/notes', require('./notes'));
router.use('/steps', require('./steps'));
// router.use('/tags', require('./tags')); // @wip

// ERROR HANDLER middleware - defined with 4 args
//  sits after all our API routes and catches ValidationErrors thrown by mongoose
router.use(function(err, req, res, next) {
    if(err.name === 'ValidationError') {
        return res.status(422).json({            
            errors: Object.keys(err.errors).reduce(function(errors, key){  
                errors[key] = err.errors[key].message;
                return errors;
            }, {})
        });
    }
    return next(err);
});

module.exports = router;
