/**
 * Created by bogdanbegovic on 4/13/15.
 */

var logger = require('../util/logger');
var Professor = require('../models/professor');
var mailService = require('../util/mailService');

module.exports = function (app, permissionMiddleware) {
    'use strict';

    app.get('/professor/getProfessorByID/:id', permissionMiddleware.adminApproved, function (req, res) {
        var id = req.params.id;
        if (!id) {
            logger.error('ID not provided for professor');
            res.status(404);
            res.json('ID not provided for professor');
        } else {
            Professor.findById(id).then(
                function (data) {
                    if (!data) {
                        logger.error('Professor not found');
                        res.status(404);
                        res.json('Professor not found');
                    } else {
                        logger.info('Found professor: ' + data._id);
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

    app.post('/professor/setProfessorProfile', permissionMiddleware.isLoggedIn, function (req, res) {
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
            Professor.updateProfessor(req.body.user).then(
                function (data) {
                    logger.info('Set new professor: ' + data._id);
                    if(password !== req.user.password){
                        mailService.changePasswordMail({
                            email: req.body.user.email,
                            password: password,
                            accountType: 'PROFESSOR'
                        });
                    }
                    res.json(data);
                }, function (err) {
                    logger.error('You have to provide data for updating you profile!');
                    res.json(err);
                });
        }
    });

    app.post('/professor/editProfessorProfile', permissionMiddleware.adminApproved, function (req, res) {
        if (!req.body.user) {
            logger.error('You have to provide data for updating professor profile!');
            res.status(404);
            res.json('You have to provide data for updating professor profile!');
        } else {
            Professor.updateProfessor(req.body.user).then(
                function (data) {
                    logger.info('Edited professor: ' + data._id);
                    res.json(data);
                }, function (err) {
                    logger.error(err);
                    res.json(err);
                });
        }
    });

    app.post('/professor/createNewProfessor', permissionMiddleware.adminApproved, function (req, res, next) {
        if (!req.body.user) {
            logger.error('You have to provide professor data for new professor!');
            res.status(404);
            res.json('You have to provide professor data for new professor!');
        } else {
            Professor.createProfessor(req.body.user).then(
                function (data) {
                    logger.info('Add professor success');
                    logger.info(data._id);
                    res.json(data);
                },
                function (err) {
                    logger.error('Add professor FAIL');
                    logger.error(err);
                    res.json(err);
                }
            );
        }
    });

    app.post('/professor/deactivateProfessor', permissionMiddleware.adminApproved, function (req, res, next) {
        if (!req.body.id) {
            logger.error('You have to provide id for deactivating a professor!');
            res.status(404);
            res.json('You have to provide id for deactivating a professor!');
        } else if (req.body.id === req.user._id) {
            logger.error('You cannot disable yourself!');
            res.status(404);
            res.json('You cannot disable yourself!');
        } else {
            Professor.deactivateProfessor(req.body.id).then(
                function (data) {
                    logger.info('Deactivated professor: ' + data._id);
                    res.json(data);
                }, function (err) {
                    logger.error(err);
                    res.json(err);
                });
        }
    });

    app.get('/professor/getAllProfessors', permissionMiddleware.adminApproved, function (req, res) {
        Professor.find({}).then(
            function (data) {
                logger.info('Get All Professors');
                res.json(data);
            }, function (err) {
                logger.error(err);
                res.json(err);
            });
    });

    app.post('/professor/resetPassword', permissionMiddleware.adminApproved, function (req, res, next) {
        if (!req.body.id) {
            logger.error('You have to provide id for resetting password for a professor!');
            res.status(404);
            res.json('You have to provide id for resetting password for a professor!');
        } else {
            Professor.resetPassword(req.body.id).then(
                function (data) {
                    logger.info('Reset password for a professor: ' + data._id);
                    res.json(data);
                }, function (err) {
                    logger.error(err);
                    res.json(err);
                });
        }
    });

};