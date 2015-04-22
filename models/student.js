/**
 * Created by bogdanbegovic on 4/13/15.
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var generatePassword = require('password-generator');
var logger = require('../util/logger');
var mailService = require('../services/mailService');

var studentSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
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
    indexNum: {
        type: Number,
        required: true
    },
    userType: {
        type: String,
        default: 'STUDENT'
    },
    studentType: {
        type: String,
        required: true
    },
    generation: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
        require: true
    },
    lastLoginDate: {
        type: Date,
        default: undefined
    },
    picture: {
        type: String
    }
});

studentSchema.methods.generateHash = function (password) {
    'use strict';
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

studentSchema.statics.authenticateStudent = function (id) {
    return this.findOneAndUpdate({'_id': id}, {lastLoginDate: new Date()}, {upsert: false}).lean().exec();
};

studentSchema.statics.updateStudent = function (student) {
    return this.findOneAndUpdate({'_id': student._id}, student, {upsert: false}).lean().exec();
};

studentSchema.statics.createStudent = function (student) {
    var promise = new mongoose.Promise;
    var self = this;
    this.findOne({'email': student.email}).exec().then(
        function (user) {
            var err;
            if (user) {
                err = 'User already exists';
                logger.error(err);
                promise.error(err);
            } else if (!student.email || !student.firstName || !student.lastName) {
                err = 'Validation error';
                logger.error(err);
                promise.error(err);
            } else {
                var password = generatePassword(12, false, /\d/, 'met');
                var newUser = new self();
                newUser.email = student.email;
                newUser.firstName = student.firstName;
                newUser.lastName = student.lastName;
                newUser.password = newUser.generateHash(password);
                newUser.picture = student.picture;
                newUser.indexNum = student.indexNum;
                newUser.generation = student.generation;
                newUser.studentType = student.studentType;
                newUser.save(function (err) {
                    if (err) {
                        logger.error(err);
                        promise.error(err);
                    } else {
                        mailService.sendEmail({
                            email: student.email,
                            password: password,
                            accountType: 'STUDENT'
                        });
                        logger.info('Added new student: ' + newUser._id);
                        promise.complete(newUser);
                    }
                });
            }
        },
        function (err) {
            logger.error(err);
            promise.error(err);
        }
    );
    return promise;
};

studentSchema.statics.deactivateStudent = function (id) {
    return this.findOneAndUpdate({'_id': id}, {isActive: false}, {upsert: false}).lean().exec();
};

studentSchema.methods.logTime = function () {
    var promise = new mongoose.Promise;
    this.lastLoginDate = new Date();
    this.save(function (err) {
        if (err) {
            promise.error(err);
        } else {
            promise.complete(true);
        }
    });
    return promise;
};

module.exports = mongoose.model('Student', studentSchema);