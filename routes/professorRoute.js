/**
 * Created by bogdanbegovic on 4/13/15.
 */

module.exports = function (app, permissionMiddleware, logger) {
    'use strict';

    var professorService = require('../services/professorService')(logger);

    app.get('/professor/getProfessorByID/:id', permissionMiddleware.adminApproved, function (req, res) {
        var id = req.params.id;
        if(!id){
            logger.error('ID not provided for professor');
            res.status(404);
            res.json({message: 'ID not provided for professor'});
        }else{
            professorService.getProfessorByID(id).then(
                function(data){
                    if(!data){
                        logger.error('Professor not found');
                        res.status(404);
                        res.json({message:'Professor not found'});
                    }else{
                        logger.info('Found professor: ' + data._id);
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

    app.post('/professor/setProfessorProfile', permissionMiddleware.isLoggedIn, function (req, res) {
        if (!req.body.user) {
            logger.error('You have to provide data for updating you profile!');
            res.status = 404;
            res.json({message: 'You have to provide data for updating you profile!'});
        }else if (req.body.user._id !== req.user._id) {
            logger.error('You can only change you profile!');
            res.status = 404;
            res.json({message: 'You can only change you profile!'});
        } else {
            professorService.updateProfessor(req.body.user).then(function (err, data) {
                if (err) {
                    logger.error('You have to provide data for updating you profile!');
                    res.json(err);
                } else {
                    logger.info('Set new professor: ' + data._id);
                    res.json(data);
                }
            });
        }
    });

    app.post('/professor/editProfessorProfile', permissionMiddleware.adminApproved, function (req, res) {
        if (!req.body.user) {
            logger.error('You have to provide data for updating professor profile!');
            res.status = 404;
            res.json({message: 'You have to provide data for updating professor profile!'});
        } else {
            professorService.updateProfessor(req.body.user).then(function (err, data) {
                if (err) {
                    logger.error(err);
                    res.json(err);
                } else {
                    logger.info('Edited professor: ' + data._id);
                    res.json(data);
                }
            });
        }
    });

    app.post('/professor/createNewProfessor', permissionMiddleware.adminApproved, function (req, res, next) {
        if (!req.body.user) {
            logger.error('You have to provide professor data for new professor!');
            res.status = 404;
            res.json({message: 'You have to provide professor data for new professor!'});
        } else {
            res.json(professorService.createProfessor(req.body.user));
        }
    });

    app.post('/professor/deactivateProfessor', permissionMiddleware.adminApproved, function (req, res, next) {
        if(!req.body.id){
            logger.error('You have to provide id for deactivating a professor!');
            res.status = 404;
            res.json({message: 'You have to provide id for deactivating a professor!'});
        } else if (req.body.id === req.user._id) {
            logger.error('You cannot disable yourself!');
            res.status = 404;
            res.json({message: 'You cannot disable yourself!'});
        } else {
            professorService.deactivateProfessor(req.body.id).then(function (err, data) {
                if (err) {
                    logger.error(err);
                    res.json(err);
                } else {
                    logger.info('Deactivated professor: ' + data._id);
                    res.json(data);
                }
            });
        }
    });

    app.get('/professor/getAllProfessors', permissionMiddleware.adminApproved, function (req, res) {
        professorService.getAllProfessors().then(function (err, data) {
            if (err) {
                logger.error(err);
                res.json(err);
            } else {
                logger.info('Get All Professors');
                res.json(data);
            }
        });
    });

};