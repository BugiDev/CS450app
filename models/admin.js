/**
 * Created by bogdanbegovic on 4/13/15.
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var generatePassword = require('password-generator');
var logger = require('../util/logger');
var mailService = require('../util/mailService');

var adminSchema = mongoose.Schema({
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
    isActive: {
        type: Boolean,
        default: true,
        require: true
    },
    userType: {
        type: String,
        default: 'ADMIN'
    },
    lastLoginDate: {
        type: Date,
        default: undefined
    },
    picture: String
});

adminSchema.methods.generateHash = function (password) {
    'use strict';
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

adminSchema.statics.generateHash = function (password) {
    'use strict';
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

adminSchema.statics.resetPassword = function(id){
    'use strict';
    var promise = new mongoose.Promise;
    var self = this;
    var password = generatePassword(12, false, /\d/, 'met');
    this.findOneAndUpdate({'_id': id}, {password: self.generateHash(password)}, {upsert: false}).lean().exec().then(
        function(data){
            mailService.sendEmail({
                email: data.email,
                password: password,
                accountType: 'ADMIN'
            });
            logger.info('Changed password for admin: ' + data._id);
            promise.complete(data);
        },
        function(err){
            logger.error(err);
            promise.error(err);
        }
    );
    return promise;
};

adminSchema.statics.authenticateAdmin = function (id) {
    'use strict';
    return this.findOneAndUpdate({'_id': id}, {lastLoginDate: new Date()}, {upsert: false}).lean().exec();
};
adminSchema.statics.updateAdmin = function (admin) {
    'use strict';
    return this.findOneAndUpdate({'_id': admin._id}, admin, {upsert: false}).lean().exec();
};

adminSchema.statics.createAdmin = function (admin) {
    'use strict';
    var promise = new mongoose.Promise;
    var self = this;
    this.findOne({'email': admin.email}).exec().then(
        function (user) {
            var err;
            if (user) {
                err = 'User already exists';
                logger.error(err);
                promise.error(err);
            } else if (!admin.email || !admin.firstName || !admin.lastName) {
                err = 'Validation error';
                logger.error(err);
                promise.error(err);
            } else {
                var password = generatePassword(12, false, /\d/, 'met');
                var newUser = new self();
                newUser.email = admin.email;
                newUser.firstName = admin.firstName;
                newUser.lastName = admin.lastName;
                newUser.password = newUser.generateHash(password);
                newUser.picture = admin.picture;

                newUser.save(function (err) {
                    if (err) {
                        logger.error(err);
                        promise.error(err);
                    } else {
                        mailService.sendEmail({email: admin.email, password: password, accountType: 'ADMIN'});
                        logger.info('Added new admin: ' + newUser._id);
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

adminSchema.statics.deactivateAdmin = function (id) {
    'use strict';
    return this.findOneAndUpdate({'_id': id}, {isActive: false}, {upsert: false}).lean().exec();
};

adminSchema.methods.logTime = function () {
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

module.exports = mongoose.model('Admin', adminSchema);
