/**
 * Created by bogdanbegovic on 4/13/15.
 */

var logger = require('../util/logger');
var Attendance = require('../models/attendance');

module.exports = function (app, permissionMiddleware) {
    'use strict';

    app.get('/attendance/getAllAttendance', permissionMiddleware.adminAndProfessorApproved, function (req, res) {
        Attendance.find({}).sort({ weekNum : 'ascending'}).then(
            function (data) {
                logger.info('Get All Attendance');
                res.json(data);
            }, function (err) {
                logger.error(err);
                res.json(err);
            });
    });

    app.get('/attendance/lectures/getAllLectureAttendance', permissionMiddleware.adminAndProfessorApproved, function (req, res) {
        Attendance.find({attendanceType: 'LECTURES'}).then(
            function (data) {
                logger.info('Get All Lecture Attendance');
                res.json(data);
            }, function (err) {
                logger.error(err);
                res.json(err);
            });
    });

    app.get('/attendance/labs/getAllLabsAttendance', permissionMiddleware.adminAndProfessorApproved, function (req, res) {
        Attendance.find({attendanceType: 'LABS'}).then(
            function (data) {
                logger.info('Get All Labs Attendance');
                res.json(data);
            }, function (err) {
                logger.error(err);
                res.json(err);
            });
    });

    app.get('/attendance/lectures/getLectureByID/:id', permissionMiddleware.adminAndProfessorApproved, function (req, res) {
        var id = req.params.id;
        if (!id) {
            logger.error('ID not provided for lecture');
            res.status(404);
            res.json('ID not provided for lecture');
        } else {
            Attendance.findById(id).then(
                function (data) {
                    if (!data) {
                        logger.error('Lecture not found');
                        res.status(404);
                        res.json('Lecture not found');
                    } else {
                        logger.info('Found lecture: ' + data._id);
                        res.json(data);
                    }
                }, function (err) {
                    logger.error(err);
                    res.status(404);
                    res.json(err);
                }
            );
        }
    });

    app.get('/attendance/labs/getLabsByID/:id', permissionMiddleware.adminAndProfessorApproved, function (req, res) {
        var id = req.params.id;
        if (!id) {
            logger.error('ID not provided for lab');
            res.status(404);
            res.json('ID not provided for lab');
        } else {
            Attendance.findById(id).then(
                function (data) {
                    if (!data) {
                        logger.error('Lab not found');
                        res.status(404);
                        res.json('Lab not found');
                    } else {
                        logger.info('Found lab: ' + data._id);
                        res.json(data);
                    }
                }, function (err) {
                    logger.error(err);
                    res.status(404);
                    res.json(err);
                }
            );
        }
    });

    app.post('/attendance/lectures/updateLecture', permissionMiddleware.adminAndProfessorApproved, function (req, res) {
        if (!req.body.week) {
            logger.error('You have to provide data for updating lecture!');
            res.status(404);
            res.json('You have to provide data for updating lecture!');
        } else if (req.body.week.attendanceType !== 'LECTURES') {
            logger.error('Attendance type has to be LECTURES!');
            res.status(404);
            res.json('Attendance type has to be LECTURES!');
        } else {
            Attendance.updateAttendance(req.body.week).then(
                function (data) {
                    logger.info('Updated lectures: ' + data._id);
                    res.json(data);
                }, function (err) {
                    logger.error('Error while updating lectures!');
                    res.json(err);
                });
        }
    });

    app.post('/attendance/labs/updateLabs', permissionMiddleware.adminAndProfessorApproved, function (req, res) {
        if (!req.body.week) {
            logger.error('You have to provide data for updating labs!');
            res.status(404);
            res.json('You have to provide data for updating labs!');
        } else if (req.body.week.attendanceType !== 'LABS') {
            logger.error('Attendance type has to be LABS!');
            res.status(404);
            res.json('Attendance type has to be LABS!');
        } else {
            Attendance.updateAttendance(req.body.week).then(
                function (data) {
                    logger.info('Updated lectures: ' + data._id);
                    res.json(data);
                }, function (err) {
                    logger.error('You have to provide data for updating lectures!');
                    res.json(err);
                });
        }
    });

};