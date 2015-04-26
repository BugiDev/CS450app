/**
 * Created by bogdanbegovic on 4/13/15.
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var generatePassword = require('password-generator');
var logger = require('../util/logger');
var mailService = require('../util/mailService');

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
    },
    preexamPoints:{
        homeworkAssignment: [{
            ordinalNum: {type: Number, required: true},
            pointsAchieved: {type: Number, required: true},
            maxPoints: {type: Number},
            inputDate: {type: Date, default: new Date(), required: true},
            remark: {type: String}
        }],
        tests:[{
            ordinalNum: {type: Number, required: true},
            pointsAchieved: {type: Number, required: true},
            maxPoints: {type: Number, required: true},
            inputDate: {type: Date, default: new Date(), required: true},
            remark: {type: String}
        }],
        projects:[{
            ordinalNum: {type: Number, required: true},
            pointsAchieved: {type: Number, required: true},
            maxPoints: {type: Number},
            inputDate: {type: Date, default: new Date(), required: true},
            remark: {type: String}
        }],
        classActivity: [{
            ordinalNum: {type: Number, required: true},
            pointsAchieved: {type: Number, required: true},
            maxPoints: {type: Number},
            inputDate: {type: Date, default: new Date(), required: true},
            remark: {type: String}
        }],
        colloquium: [{
            ordinalNum: {type: Number, required: true},
            pointsAchieved: {type: Number, required: true},
            maxPoints: {type: Number},
            inputDate: {type: Date, default: new Date(), required: true},
            remark: {type: String}
        }],
        seminarAssignment: [{
            ordinalNum: {type: Number, required: true},
            pointsAchieved: {type: Number, required: true},
            maxPoints: {type: Number},
            inputDate: {type: Date, default: new Date(), required: true},
            remark: {type: String}
        }]
    },
    examPoints:{
        pointsAchieved: {type:Number},
        maxPoints: {type: Number},
        inputDate: {type: Date, default: new Date()},
        remark: {type: String}
    }
});

studentSchema.methods.generateHash = function (password) {
    'use strict';
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

studentSchema.statics.authenticateStudent = function (id) {
    'use strict';
    return this.findOneAndUpdate({'_id': id}, {lastLoginDate: new Date()}, {upsert: false}).lean().exec();
};

studentSchema.statics.updateStudent = function (student) {
    'use strict';
    return this.findOneAndUpdate({'_id': student._id}, student, {upsert: false}).lean().exec();
};

studentSchema.statics.updatePreexamPoints = function (id, preexamPoints) {
    'use strict';
    var promise = new mongoose.Promise;
    this.update({_id: id}, {preexamPoints: preexamPoints}, function (err, doc) {
        if (err) {
            logger.error(err);
            promise.error(err);
        } else {
            promise.complete(doc);
        }
    });
    return promise;
};

studentSchema.statics.updateExamPoints = function (id, examPoints) {
    'use strict';
    var promise = new mongoose.Promise;
    this.update({_id: id}, {examPoints: examPoints}, function (err, doc) {
        if (err) {
            logger.error(err);
            promise.error(err);
        } else {
            promise.complete(doc);
        }
    });
    return promise;
};

studentSchema.statics.createStudent = function (student) {
    'use strict';
    var promise = new mongoose.Promise;
    var Self = this;
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
                var newUser = new Self();
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
    'use strict';
    return this.findOneAndUpdate({'_id': id}, {isActive: false}, {upsert: false}).lean().exec();
};

studentSchema.methods.logTime = function () {
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

module.exports = mongoose.model('Student', studentSchema);