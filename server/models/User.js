var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config').secret;

var UserSchema = new mongoose.Schema({
    username: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
    email: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
    bio: String,
    image: String,
    hash: String,
    salt: String,
}, { timestamps: true });

UserSchema.plugin(uniqueValidator, { message: 'is already taken.'});

UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    // pbkdf2Sync <= password, salt, iteration, length of hash, algorithm
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

UserSchema.methods.generateJWT = function() {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    
    return jwt.sign({
        id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000),
    }, secret);
};

UserSchema.methods.toAuthJSON = function() {
    return {
        username: this.username,
        email: this.email,
        bio: this.bio, // not in original Thinkster tutorial - not having this here prevented bio population on app.settings
        image: this.image, // not in original Thinkster tutorial - not having this here prevented image population on app.settings
        token: this.generateJWT()
    };
};

UserSchema.methods.toProfileJSONFor = function(user) { // TODO: don't need to pass user to this method - remove and fix all method calls
    return {
        id: this.id,
        username: this.username,
        bio: this.bio,
        image: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'
        // following: false // TODO - implement following functionality from Thinkster Full Stack
    };
};

mongoose.model('User', UserSchema);
