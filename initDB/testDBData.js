/**
 * Created by bogdanbegovic on 4/24/15.
 */

var colors = require('colors/safe');
var logger = require('../util/logger');
var Attendance = require('../models/attendance');
var Admin = require('../models/admin');
var Professor = require('../models/professor');
var Student = require('../models/student');
var Q = require('q');
var _ = require('underscore');

var deferredAdmin = Q.defer();
var deferredProfessor = Q.defer();
var deferredStudent1 = Q.defer();
var deferredStudent2 = Q.defer();
var deferredStudent3 = Q.defer();
var deferredLabs = Q.defer();
var deferredLectures = Q.defer();

var defaultAdmin = new Admin();
defaultAdmin.firstName = 'admin';
defaultAdmin.lastName = 'admin';
defaultAdmin.email = 'admin@cs450app.com';
defaultAdmin.password = defaultAdmin.generateHash('admin123');

var defaultProfessor = new Professor();
defaultProfessor.firstName = 'professor';
defaultProfessor.lastName = 'professor';
defaultProfessor.email = 'professor@cs450app.com';
defaultProfessor.password = defaultProfessor.generateHash('professor123');


var defaultStudent1 = new Student();
defaultStudent1.firstName = 'student1';
defaultStudent1.lastName = 'student1';
defaultStudent1.email = 'student1@cs450app.com';
defaultStudent1.password = defaultStudent1.generateHash('student123');
defaultStudent1.indexNum = 1;
defaultStudent1.generation = '2014/2015';
defaultStudent1.studentType = 'Traditional';
defaultStudent1.preexamPoints = {
    homeworkAssignment: [
        {
            ordinalNum: 1,
            pointsAchieved: 1,
            maxPoints: 1.5,
            remark: 'asd'
        },
        {
            ordinalNum: 2,
            pointsAchieved: 1,
            maxPoints: 1.5,
            remark: 'asd'
        },
        {
            ordinalNum: 3,
            pointsAchieved: 1,
            maxPoints: 1.5,
            remark: 'asd'
        }
    ],
    tests: [
        {
            ordinalNum: 1,
            pointsAchieved: 1,
            maxPoints: 1.5,
            remark: 'asd'
        },
        {
            ordinalNum: 2,
            pointsAchieved: 1,
            maxPoints: 1.5,
            remark: 'asd'
        },
        {
            ordinalNum: 3,
            pointsAchieved: 1,
            maxPoints: 1.5,
            remark: 'asd'
        }
    ],
    projects: [
        {
            ordinalNum: 1,
            pointsAchieved: 10,
            maxPoints: 25,
            remark: 'asd'
        }
    ],
    classActivity: [],
    colloquium: [],
    seminarAssignment: []
};
defaultStudent1.examPoints = {
    pointsAchieved: 15,
    maxPoints: 30,
    remark: ''
};

var defaultStudent2 = new Student();
defaultStudent2.firstName = 'student2';
defaultStudent2.lastName = 'student2';
defaultStudent2.email = 'student2@cs450app.com';
defaultStudent2.password = defaultStudent1.generateHash('student123');
defaultStudent2.indexNum = 2;
defaultStudent2.generation = '2014/2015';
defaultStudent2.studentType = 'Traditional';
defaultStudent2.preexamPoints = {
    homeworkAssignment: [
        {
            ordinalNum: 1,
            pointsAchieved: 1,
            maxPoints: 1.5,
            remark: 'asd'
        },
        {
            ordinalNum: 2,
            pointsAchieved: 1,
            maxPoints: 1.5,
            remark: 'asd'
        },
        {
            ordinalNum: 3,
            pointsAchieved: 1,
            maxPoints: 1.5,
            remark: 'asd'
        }
    ],
    tests: [
        {
            ordinalNum: 1,
            pointsAchieved: 1,
            maxPoints: 1.5,
            remark: 'asd'
        },
        {
            ordinalNum: 2,
            pointsAchieved: 1,
            maxPoints: 1.5,
            remark: 'asd'
        },
        {
            ordinalNum: 3,
            pointsAchieved: 1,
            maxPoints: 1.5,
            remark: 'asd'
        }
    ],
    projects: [
        {
            ordinalNum: 1,
            pointsAchieved: 15,
            maxPoints: 25,
            remark: 'asd'
        }
    ],
    classActivity: [],
    colloquium: [],
    seminarAssignment: []
};
defaultStudent2.examPoints = {
    pointsAchieved: 15,
    maxPoints: 30,
    remark: ''
};

var defaultStudent3 = new Student();
defaultStudent3.firstName = 'student3';
defaultStudent3.lastName = 'student3';
defaultStudent3.email = 'student3@cs450app.com';
defaultStudent3.password = defaultStudent1.generateHash('student123');
defaultStudent3.indexNum = 3;
defaultStudent3.generation = '2014/2015';
defaultStudent3.studentType = 'Internet';
defaultStudent3.preexamPoints = {
    homeworkAssignment: [
        {
            ordinalNum: 1,
            pointsAchieved: 1,
            maxPoints: 1.5,
            remark: 'asd'
        },
        {
            ordinalNum: 2,
            pointsAchieved: 1,
            maxPoints: 1.5,
            remark: 'asd'
        },
        {
            ordinalNum: 3,
            pointsAchieved: 1,
            maxPoints: 1.5,
            remark: 'asd'
        }
    ],
    tests: [
        {
            ordinalNum: 1,
            pointsAchieved: 1,
            maxPoints: 1.5,
            remark: 'asd'
        },
        {
            ordinalNum: 2,
            pointsAchieved: 1,
            maxPoints: 1.5,
            remark: 'asd'
        },
        {
            ordinalNum: 3,
            pointsAchieved: 1,
            maxPoints: 1.5,
            remark: 'asd'
        }
    ],
    projects: [
        {
            ordinalNum: 1,
            pointsAchieved: 0,
            maxPoints: 25,
            remark: 'asd'
        }
    ],
    classActivity: [],
    colloquium: [],
    seminarAssignment: []
};

var student1Id = '';
var student2Id = '';
var student3Id = '';

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
    logger.info(colors.green('DB opened OK!'));

    var lectureDates = new Date();
//var lectureDates = [values...]
    var labDates = new Date();
//var labDates = [values...]

    Admin.findOne({email: 'admin@cs450app.com'}).then(
        function (data) {
            if (!data) {
                defaultAdmin.save(function (err) {
                    if (err) {
                        logger.error(colors.red.underline(err));
                        deferredAdmin.reject(err);
                    } else {
                        logger.info(colors.green('Added default admin. Username: ' + defaultAdmin.email + ' | Password: admin123'));
                        deferredAdmin.resolve();
                    }
                });
            } else {
                deferredAdmin.reject('Default admin already created');
            }
        }, function (err) {
            logger.error(colors.red.underline(err));
            deferredAdmin.reject(err);
        }
    );

    Professor.findOne({email: 'professor@cs450app.com'}).then(
        function (data) {
            if (!data) {
                defaultProfessor.save(function (err) {
                    if (err) {
                        logger.error(colors.red.underline(err));
                        deferredProfessor.reject(err);
                    } else {
                        logger.info(colors.green('Added default professor. Username: ' + defaultProfessor.email + ' | Password: professor123'));
                        deferredProfessor.resolve();
                    }
                });
            } else {
                deferredProfessor.reject('Default professor already created');
            }
        }, function (err) {
            logger.error(colors.red.underline(err));
            deferredProfessor.reject(err);
        }
    );

    Student.findOne({email: 'student1@cs450app.com'}).then(
        function (data) {
            if (!data) {
                defaultStudent1.save(function (err) {
                    if (err) {
                        logger.error(colors.red.underline(err));
                        deferredStudent1.reject(err);
                    } else {
                        logger.info(colors.green('Added default student 1. Username: ' + defaultStudent1.email + ' | Password: student123'));
                        deferredStudent1.resolve();
                    }
                });
            } else {
                deferredStudent1.reject('Default student 1 already created');
            }
        }, function (err) {
            logger.error(colors.red.underline(err));
            deferredStudent1.reject(err);
        }
    );

    Student.findOne({email: 'student2@cs450app.com'}).then(
        function (data) {
            if (!data) {
                defaultStudent2.save(function (err) {
                    if (err) {
                        logger.error(colors.red.underline(err));
                        deferredStudent2.reject(err);
                    } else {
                        logger.info(colors.green('Added default student 2. Username: ' + defaultStudent2.email + ' | Password: student123'));
                        deferredStudent2.resolve();
                    }
                });
            } else {
                deferredStudent2.reject('Default student 2 already created');
            }
        }, function (err) {
            logger.error(colors.red.underline(err));
            deferredStudent2.reject(err);
        }
    );

    Student.findOne({email: 'student3@cs450app.com'}).then(
        function (data) {
            if (!data) {
                defaultStudent3.save(function (err) {
                    if (err) {
                        logger.error(colors.red.underline(err));
                        deferredStudent3.reject(err);
                    } else {
                        logger.info(colors.green('Added default student 3. Username: ' + defaultStudent3.email + ' | Password: student123'));
                        deferredStudent3.resolve();
                    }
                });
            } else {
                deferredStudent3.reject('Default student 3 already created');
            }
        }, function (err) {
            logger.error(colors.red.underline(err));
            deferredStudent3.reject(err);
        }
    );

    Q.all([deferredAdmin.promise, deferredProfessor.promise, deferredStudent1.promise, deferredStudent2.promise, deferredStudent3.promise]).then(
        function (data) {

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

                            var rand = Math.floor((Math.random() * 10) + 1);
                            var lectureAttenders = [];
                            if(rand >=5){
                                lectureAttenders.push(student1Id);
                            }
                            rand = Math.floor((Math.random() * 10) + 1);
                            if(rand >=5){
                                lectureAttenders.push(student2Id);
                            }

                            rand = Math.floor((Math.random() * 10) + 1);
                            var labAttenders = [];
                            if(rand >=5){
                                labAttenders.push(student1Id);
                            }
                            rand = Math.floor((Math.random() * 10) + 1);
                            if(rand >=5){
                                labAttenders.push(student2Id);
                            }

                            lecturesArr.push({weekNum: i, weekDate: lectureDate, attendanceType: 'LECTURES', attenders: lectureAttenders});
                            labsArr.push({weekNum: i, weekDate: labDate, attendanceType: 'LABS', attenders: labAttenders});
                        }

                        Attendance.collection.insert(lecturesArr, function (err, data) {
                            if (err) {
                                logger.error(colors.red.underline(err));
                                deferredLectures.reject(err);
                            } else {
                                logger.info(colors.green('Created all lectures OK!'));
                                deferredLectures.resolve();
                            }
                        });

                        Attendance.collection.insert(labsArr, function (err, data) {
                            if (err) {
                                logger.error(colors.red.underline(err));
                                deferredLabs.reject(err);
                            } else {
                                logger.info(colors.green('Created all labs OK!'));
                                deferredLabs.resolve();
                            }
                        });

                    } else {
                        deferredLectures.reject('Lectures already created!');
                        deferredLabs.reject('Labs already created');
                    }
                },
                function (err) {
                    logger.error(colors.red.underline(err));
                    deferredLectures.reject(err);
                    deferredLabs.reject(err);
                }
            );
        },
        function (err) {
            logger.error(colors.red.underline(err));
            process.exit(1);
        }
    );

    Q.all([deferredLabs.promise, deferredLectures.promise]).then(
        function (data) {
            logger.info(colors.green('Data initialized OK!'));
            process.exit(0);
        },
        function (err) {
            logger.error(colors.red.underline(err));
            process.exit(1);
        }
    );

});

