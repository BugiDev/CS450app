/**
 * Created by bogdanbegovic on 4/13/15.
 */
/**
 * Created by bogdanbegovic on 4/13/15.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var professorSchema = mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        default: 'PROFESSOR'
    },
    lastLoginDate:{
        type: Date
    },
    picture: String
});

professorSchema.methods.generateHash = function (password) {
    'use strict';
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Professor', professorSchema);