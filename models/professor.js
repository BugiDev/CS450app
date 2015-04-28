/**
 * Created by bogdanbegovic on 4/13/15.
 */
/**
 * Created by bogdanbegovic on 4/13/15.
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var generatePassword = require('password-generator');
var logger = require('../util/logger');
var mailService = require('../util/mailService');

var professorSchema = mongoose.Schema({
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
    userType: {
        type: String,
        default: 'PROFESSOR'
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
    picture: String
});

professorSchema.methods.generateHash = function (password) {
    'use strict';
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

professorSchema.statics.generateHash = function (password) {
    'use strict';
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

professorSchema.statics.resetPassword = function(id){
    'use strict';
    var promise = new mongoose.Promise;
    var self = this;
    var password = generatePassword(12, false, /\d/, 'met');
    this.findOneAndUpdate({'_id': id}, {password: self.generateHash(password)}, {upsert: false}).lean().exec().then(
        function(data){
            mailService.sendEmail({
                email: data.email,
                password: password,
                accountType: 'PROFESSOR'
            });
            logger.info('Changed password for professor: ' + data._id);
            promise.complete(data);
        },
        function(err){
            logger.error(err);
            promise.error(err);
        }
    );
    return promise;
};

professorSchema.statics.authenticateProfessor = function (id) {
    'use strict';
    return this.findOneAndUpdate({'_id': id}, {lastLoginDate: new Date()}, {upsert: false}).lean().exec();
};

professorSchema.statics.updateProfessor = function (professor) {
    'use strict';
    return this.findOneAndUpdate({'_id': professor._id}, professor, {upsert: false}).lean().exec();
};

professorSchema.statics.createProfessor = function (professor) {
    'use strict';
    var promise = new mongoose.Promise;
    var Self = this;
    this.findOne({'email': professor.email}).exec().then(
        function (user) {
            var err;
            if (user) {
                err = 'User already exists';
                logger.error(err);
                promise.error(err);
            } else if (!professor.email || !professor.firstName || !professor.lastName) {
                err = 'Validation error';
                logger.error(err);
                promise.error(err);
            } else {
                var password = generatePassword(12, false, /\d/, 'met');
                var newUser = new Self();
                newUser.email = professor.email;
                newUser.firstName = professor.firstName;
                newUser.lastName = professor.lastName;
                newUser.password = newUser.generateHash(password);
                newUser.picture = professor.picture;

                newUser.save(function (err) {
                    if (err) {
                        logger.error(err);
                        promise.error(err);
                    } else {
                        mailService.sendEmail({
                            email: professor.email,
                            password: password,
                            accountType: 'PROFESSOR'
                        });
                        logger.info('Added new professor: ' + newUser._id);
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

professorSchema.statics.deactivateProfessor = function (id) {
    'use strict';
    return this.findOneAndUpdate({'_id': id}, {isActive: false}, {upsert: false}).lean().exec();
};

professorSchema.methods.logTime = function () {
    'use strict';
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

module.exports = mongoose.model('Professor', professorSchema);