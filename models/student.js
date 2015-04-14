/**
 * Created by bogdanbegovic on 4/13/15.
 */
/**
 * Created by bogdanbegovic on 4/13/15.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var studentSchema = mongoose.Schema({
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
        default: 'STUDENT'
    },
    studentType:{
        type: String,
        required: true
    },
    generation:{
        type: String,
        required: true
    },
    lastLoginDate:{
        type: Date
    },
    picture: {
        type: String
    }
});

studentSchema.methods.generateHash = function (password) {
    'use strict';
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Student', studentSchema);