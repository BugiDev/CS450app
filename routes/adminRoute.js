/**
 * Created by bogdanbegovic on 4/13/15.
 */

module.exports = function (app, permissionMiddleware, logger) {
    'use strict';

    var adminService = require('../services/adminService')(logger);

    app.get('/admin/getAdminByID/:id', permissionMiddleware.adminApproved, function (req, res) {
        var id = req.params.id;
        if(!id){
            logger.error('ID not provided for admin');
            res.status(404);
            res.json({message: 'ID not provided for admin'});
        }else{
            adminService.getAdminByID(id).then(
                function(data){
                    if(!data){
                        logger.error('Admin not found');
                        res.status(404);
                        res.json({message:'Admin not found'});
                    }else{
                        logger.info('Found admin: ' + data._id);
                        res.json(data);
                    }
                }, function(err){
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
            res.status = 404;
            res.json({message: 'You have to provide data for updating you profile!'});
        }else if (req.body.user._id !== req.user._id) {
            logger.error('You can only change you profile!');
            res.status = 404;
            res.json({message: 'You can only change you profile!'});
        } else {
            adminService.updateAdmin(req.body.user).then(function (err, data) {
                if (err) {
                    logger.error('You have to provide data for updating you profile!');
                    res.json(err);
                } else {
                    logger.info('Set new admin: ' + data._id);
                    res.json(data);
                }
            });
        }
    });

    app.post('/admin/editAdminProfile', permissionMiddleware.adminApproved, function (req, res) {
        if (!req.body.user) {
            logger.error('You have to provide data for updating admin profile!');
            res.status = 404;
            res.json({message: 'You have to provide data for updating admin profile!'});
        } else {
            adminService.updateAdmin(req.body.user).then(function (err, data) {
                if (err) {
                    logger.error(err);
                    res.json(err);
                } else {
                    logger.info('Edited admin: ' + data._id);
                    res.json(data);
                }
            });
        }
    });

    app.post('/admin/createNewAdmin', permissionMiddleware.adminApproved, function (req, res, next) {
        if (!req.body.user) {
            logger.error('You have to provide admin data for new admin!');
            res.status = 404;
            res.json({message: 'You have to provide admin data for new admin!'});
        } else {
            res.json(adminService.createAdmin(req.body.user));
        }
    });

    app.post('/admin/deactivateAdmin', permissionMiddleware.adminApproved, function (req, res, next) {
        if(!req.body.id){
            logger.error('You have to provide id for deactivating a admin!');
            res.status = 404;
            res.json({message: 'You have to provide id for deactivating a admin!'});
        } else if (req.body.id === req.user._id) {
            logger.error('You cannot disable yourself!');
            res.status = 404;
            res.json({message: 'You cannot disable yourself!'});
        } else {
            adminService.deactivateAdmin(req.body.id).then(function (err, data) {
                if (err) {
                    logger.error(err);
                    res.json(err);
                } else {
                    logger.info('Deactivated admin: ' + data._id);
                    res.json(data);
                }
            });
        }
    });

    app.get('/admin/getAllAdmins', permissionMiddleware.adminApproved, function (req, res) {
        adminService.getAllAdmins().then(function (err, data) {
            if (err) {
                logger.error(err);
                res.json(err);
            } else {
                logger.info('Get All Admins');
                res.json(data);
            }
        });
    });

};