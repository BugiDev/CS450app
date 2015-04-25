/**
 * Created by bogdanbegovic on 4/24/15.
 */

var logger = require('../util/logger');
var Attendance = require('../models/attendance');
var Admin = require('../models/admin');
var Q = require('q');
var _ = require('underscore');

var deferredAdmin = Q.defer();
var deferredLabs = Q.defer();
var deferredLectures = Q.defer();

var configDB = require('../config/database.js');
var mongoose = require('mongoose');
mongoose.connect(configDB.url + configDB.dbName);
var db = mongoose.connection;
db.on('error', function () {
    'use strict';
    console.error('DB connection error!');
});
db.once('open', function () {
    'use strict';

    console.log('DB opened OK!');

    var lectureDates = new Date();
//var lectureDates = [values...]
    var labDates = new Date();
//var labDates = [values...]

    Admin.findOne({firstName: 'admin', lastName: 'admin'}).then(
        function (data) {
            if (!data) {
                var admin = new Admin();
                admin.firstName = 'admin';
                admin.lastName = 'admin';
                admin.email = 'admin@admin.com';
                admin.password = admin.generateHash('admin123');
                admin.save(function (err) {
                    if (err) {
                        console.log(err);
                        deferredAdmin.reject(err);
                    } else {
                        logger.info('Added default admin. Username: ' + admin.email + ' | Password: ' + admin.password);
                        deferredAdmin.resolve();
                    }
                });
            }else{
                deferredAdmin.reject('Default admin already created');
            }
        }, function (err) {
            console.error('admin error');
            logger.error(err);
            deferredAdmin.reject(err);
        }
    );

    Attendance.find({}).then(
        function (data) {
            if (data.length === 0) {
                var lecturesArr = [];
                var labsArr = [];

                for (var i = 1; i <= 15; i++) {
                    var lectureDate;
                    var labDate;
                    if (_.isArray(lectureDates)) {
                        lectureDate = new Date(lectureDates[i - 1]);
                    } else {
                        lectureDate = new Date(new Date().getTime() + (i - 1) * 604800000);
                    }
                    if (_.isArray(labDates)) {
                        labDate = new Date(labDates[i - 1]);
                    } else {
                        labDate = new Date(new Date().getTime() + (i - 1) * 604800000);
                    }

                    lecturesArr.push({weekNum: i, weekDate: lectureDate, attendanceType: 'LECTURES', attenders: []});
                    labsArr.push({weekNum: i, weekDate: labDate, attendanceType: 'LABS', attenders: []});
                }

                Attendance.collection.insert(lecturesArr, function (err, data) {
                    if (err) {
                        logger.error(err);
                        deferredLectures.reject(err);
                    } else {
                        logger.info('Created all lectures OK!');
                        deferredLectures.resolve();
                    }
                });

                Attendance.collection.insert(labsArr, function (err, data) {
                    if (err) {
                        logger.error(err);
                        deferredLabs.reject(err);
                    } else {
                        logger.info('Created all labs OK!');
                        deferredLabs.resolve();
                    }
                });

            } else {
                deferredLectures.reject('Lectures already created!');
                deferredLabs.reject('Labs already created');
            }
        },
        function (err) {
            logger.error(err);
            deferredLectures.reject(err);
            deferredLabs.reject(err);
        }
    );

    Q.all([deferredAdmin.promise, deferredLabs.promise, deferredLectures.promise]).then(
        function (data) {
            logger.info('Data initialized OK!');
            process.exit(0);
        },
        function (err) {
            logger.error(err);
            process.exit(1);
        }
    );

});

