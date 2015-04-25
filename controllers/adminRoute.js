/**
 * Created by bogdanbegovic on 4/13/15.
 */

var logger = require('../util/logger');
var Admin = require('../models/admin');
var mailService = require('../util/mailService');

module.exports = function (app, permissionMiddleware) {
    'use strict';

    app.get('/admin/getAdminByID/:id', permissionMiddleware.adminApproved, function (req, res) {
        var id = req.params.id;
        if (!id) {
            logger.error('ID not provided for admin');
            res.status(404);
            res.json('ID not provided for admin');
        } else {
            Admin.findById(id).then(
                function (data) {
                    if (!data) {
                        logger.error('Admin not found');
                        res.status(404);
                        res.json('Admin not found');
                    } else {
                        logger.info('Found admin: ' + data._id);
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

    app.post('/admin/setAdminProfile', permissionMiddleware.adminApproved, function (req, res) {
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
            Admin.updateAdmin(req.body.user).then(
                function (data) {
                    logger.info('Set new admin: ' + data._id);
                    if(password !== req.user.password){
                        mailService.changePasswordMail({
                            email: req.body.user.email,
                            password: password,
                            accountType: 'ADMIN'
                        });
                    }
                    res.json(data);
                }, function (err) {
                    logger.error('You have to provide data for updating you profile!');
                    res.json(err);
                });
        }
    });

    app.post('/admin/editAdminProfile', permissionMiddleware.adminApproved, function (req, res) {
        if (!req.body.user) {
            logger.error('You have to provide data for updating admin profile!');
            res.status(404);
            res.json('You have to provide data for updating admin profile!');
        } else {
            Admin.updateAdmin(req.body.user).then(
                function (data) {
                    logger.info('Edited admin: ' + data._id);
                    res.json(data);
                }, function (err) {
                    logger.error(err);
                    res.json(err);
                });
        }
    });

    app.post('/admin/createNewAdmin', permissionMiddleware.adminApproved, function (req, res, next) {
        if (!req.body.user) {
            logger.error('You have to provide admin data for new admin!');
            res.status(404);
            res.json('You have to provide admin data for new admin!');
        } else {
            Admin.createAdmin(req.body.user).then(
                function (data) {
                    logger.info('Add admin success');
                    logger.info(data._id);
                    res.json(data);
                },
                function (err) {
                    logger.error('Add admin FAIL');
                    logger.error(err);
                    res.json(err);
                }
            );
        }
    });

    app.post('/admin/deactivateAdmin', permissionMiddleware.adminApproved, function (req, res, next) {
        if (!req.body.id) {
            logger.error('You have to provide id for deactivating a admin!');
            res.status(404);
            res.json('You have to provide id for deactivating a admin!');
        } else if (req.body.id === req.user._id) {
            logger.error('You cannot disable yourself!');
            res.status(404);
            res.json('You cannot disable yourself!');
        } else {
            Admin.deactivateAdmin(req.body.id).then(
                function (data) {
                    logger.info('Deactivated admin: ' + data._id);
                    res.json(data);
                }, function (err) {
                    logger.error(err);
                    res.json(err);
                });
        }
    });

    app.get('/admin/getAllAdmins', permissionMiddleware.adminApproved, function (req, res) {
        Admin.find({}).then(
            function (data) {
                logger.info('Get All Admins');
                res.json(data);
            }, function (err) {
                logger.error(err);
                res.json(err);
            });
    });

};