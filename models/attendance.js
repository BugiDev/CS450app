/**
 * Created by bogdanbegovic on 4/13/15.
 */

var mongoose = require('mongoose');
var logger = require('../util/logger');

var attendanceSchema = mongoose.Schema({

    weekNum: {
        type: Number,
        required: true
    },

    weekDate: {
        type: Date,
        default: undefined
    },

    attendanceType: {
        type: String,
        required: true
    },

    attenders:[{
            type: String,
            required: true
    }]
});

attendanceSchema.statics.updateAttendance = function(week){
    'use strict';
    return this.findOneAndUpdate({'_id':week._id}, week, {upsert: false}).lean().exec();
};

attendanceSchema.statics.createAttendance = function (week) {
    var promise = new mongoose.Promise;
    var self = this;
    this.findOne({'weekNum': week.weekNum}).exec().then(
        function (week) {
            var err;
            if (week) {
                err = 'Week already exists';
                logger.error(err);
                promise.error(err);
            } else if (!week.weekNum || !week.weekDate) {
                err = 'Validation error';
                logger.error(err);
                promise.error(err);
            } else {
                var newWeek = new self();
                newWeek.weekNum = week.weekNum;
                newWeek.weekDate = week.weekDate;
                newWeek.attenders = week.attenders;

                newWeek.save(function (err) {
                    if (err) {
                        logger.error(err);
                        promise.error(err);
                    } else {
                        logger.info('Added new week: ' + newWeek._id + ' week number ' + newWeek.weekNum);
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

module.exports = mongoose.model('Attendance', attendanceSchema);
