/**
 * Created by bogdanbegovic on 4/13/15.
 */

var logger = require('../util/logger');
var Student = require('../models/student');
var mailService = require('../services/mailService');

module.exports = function (app, permissionMiddleware) {
    'use strict';

    app.get('/student/getStudentByID/:id', permissionMiddleware.adminApproved, function (req, res) {
        var id = req.params.id;
        if (!id) {
            logger.error('ID not provided for student');
            res.status(404);
            res.json('ID not provided for student');
        } else {
            Student.findById(id).then(
                function (data) {
                    if (!data) {
                        logger.error('Student not found');
                        res.status(404);
                        res.json('Student not found');
                    } else {
                        logger.info('Found student: ' + data._id);
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

    app.post('/student/setStudentProfile', permissionMiddleware.isLoggedIn, function (req, res) {
        if (!req.body.user) {
            logger.error('You have to provide data for updating you profile!');
            res.status(404);
            res.json('You have to provide data for updating you profile!');
        } else if (req.body.user._id !== req.user.id) {
            logger.error('You can only change you profile!');
            res.status(404);
            res.json('You can only change you profile!');
        } else {
            var password = req.body.user.password;
            if(password !== req.user.password){
                req.body.user.password = req.user.generateHash(password);
            }
            Student.updateStudent(req.body.user).then(
                function (data) {
                    logger.info('Set new student: ' + data._id);
                    if(password !== req.user.password){
                        mailService.changePasswordMail({
                            email: req.body.user.email,
                            password: password,
                            accountType: 'STUDENT'
                        });
                    }
                    res.json(data);
                }, function (err) {
                    logger.error('You have to provide data for updating you profile!');
                    res.json(err);
                });
        }
    });

    app.post('/student/editStudentProfile', permissionMiddleware.adminApproved, function (req, res) {
        if (!req.body.user) {
            logger.error('You have to provide data for updating student profile!');
            res.status(404);
            res.json('You have to provide data for updating student profile!');
        } else {
            Student.updateStudent(req.body.user).then(
                function (data) {
                    logger.info('Edit student: ' + data._id);
                    res.json(data);
                }, function (err) {
                    logger.error('You have to provide data for updating you profile!');
                    res.json(err);
                });
        }
    });

    app.post('/student/createNewStudent', permissionMiddleware.adminApproved, function (req, res, next) {
        if (!req.body.user) {
            logger.error('You have to provide student data for new student!');
            res.status(404);
            res.json('You have to provide student data for new student!');
        } else {
            Student.createStudent(req.body.user).then(
                function (data) {
                    logger.info('Add student success');
                    logger.info(data._id);
                    res.json(data);
                },
                function (err) {
                    logger.error('Add student FAIL');
                    logger.error(err);
                    res.json(err);
                }
            );
        }
    });

    app.post('/student/deactivateStudent', permissionMiddleware.adminApproved, function (req, res, next) {
        if (!req.body.id) {
            logger.error('You have to provide id for deactivating a student!');
            res.status(404);
            res.json('You have to provide id for deactivating a student!');
        } else if (req.body.id === req.user._id) {
            logger.error('You cannot disable yourself!');
            res.status(404);
            res.json('You cannot disable yourself!');
        } else {
            Student.deactivateStudent(req.body.id).then(
                function (data) {
                    logger.info('Deactivated student: ' + data._id);
                    res.json(data);
                }, function (err) {
                    logger.error(err);
                    res.json(err);
                });
        }
    });

    app.get('/student/getAllStudents', permissionMiddleware.adminApproved, function (req, res) {
        Student.find({}).then(
            function (data) {
                logger.info('Get All Students');
                res.json(data);
            }, function (err) {
                logger.error(err);
                res.json(err);
            });
    });

    app.get('/student/getAllTraditionalStudents', permissionMiddleware.adminAndProfessorApproved, function (req, res) {
        Student.find({studentType: 'Traditional'}).then(
            function (data) {
                logger.info('Get All Traditional Students');
                res.json(data);
            }, function (err) {
                logger.error(err);
                res.json(err);
            });
    });

    app.get('/student/getAllActiveStudents', permissionMiddleware.adminAndProfessorApproved, function (req, res) {
        Student.find({isActive: true}).then(
            function (data) {
                logger.info('Get All active Students');
                res.json(data);
            }, function (err) {
                logger.error(err);
                res.json(err);
            });
    });

};