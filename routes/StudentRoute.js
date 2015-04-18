/**
 * Created by bogdanbegovic on 4/13/15.
 */

module.exports = function (app, passport) {
    'use strict';

    var adminService = require('../services/adminService');
    var professorService = require('../services/professorService');
    var studentService = require('../services/studentService');

    var bcrypt = require('bcrypt-nodejs');

    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {
        // if user is authenticated in the session, carry on
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.statusCode = 401;
            res.json({poruka: 'ne moze'});
        }
    }

    function adminApproved(req, res, next) {
        if (req.isAuthenticated() && req.user.userType === 'ADMIN') {
            return next();
        } else {
            res.statusCode = 401;
            res.json({poruka: 'ne moze'});
        }
    }

    function adminAndProfessorApproved(req, res, next) {
        if (req.isAuthenticated() && (req.user.userType === 'ADMIN' || req.user.userType === 'PROFESSOR')) {
            return next();
        } else {
            res.statusCode = 401;
            res.json({poruka: 'ne moze'});
        }
    }

    app.get('/user/logout', isLoggedIn, function (req, res) {
        req.logout();
        res.json(true);
    });

    app.post('/user/auth', function (req, res, next) {
        passport.authenticate('local-login', function (err, user, info) {
            if (err) {
                res.statusCode = 500;
                return next(err);
            }
            if (!user) {
                res.statusCode = 404;
                return res.json(info);

            } else {
                req.logIn(user, function (err) {
                    if (err) {
                        return next(err);
                    }
                    return res.json(user);
                });
            }
        })(req, res, next);
    });

    app.get('/user/isAuthenticated', isLoggedIn, function (req, res) {
        res.json(true);
    });

    app.get('/user/getUserProfile', isLoggedIn, function (req, res) {
        res.json(req.user);
    });

    app.get('/user/getAdminByID/:id', adminApproved, function (req, res) {
        var id = req.param('id');
        if(!id){
            res.status(404);
            res.json({message: 'ID not provided for user'});
        }else{
            adminService.getAdminByID(id).then(
                function(data){
                    if(!data){
                        res.status(404);
                        res.json({message:'User not found'});
                    }else{
                        res.json(data);
                    }
                }, function(err){
                    res.status(404);
                    res.json(err);
                }
            );
        }
    });

    app.get('/user/getProfessorByID/:id', adminApproved, function (req, res) {
        var id = req.param('id');
        if(!id){
            res.status(404);
            res.json({message: 'ID not provided for user'});
        }else{
            professorService.getProfessorByID(id).then(
                function(data){
                    if(!data){
                        res.status(404);
                        res.json({message:'User not found'});
                    }else{
                        res.json(data);
                    }
                }, function(err){
                    res.status(404);
                    res.json(err);
                }
            );
        }
    });

    app.get('/user/getStudentByID/:id', adminAndProfessorApproved, function (req, res) {
        var id = req.param('id');
        if(!id){
            res.status(404);
            res.json({message: 'ID not provided for user'});
        }else{
            studentService.getStudentByID(id).then(
                function(data){
                    if(!data){
                        res.status(404);
                        res.json({message:'User not found'});
                    }else if(data.isActive){

                    } else{
                        res.json(data);
                    }
                }, function(err){
                    res.status(404);
                    res.json(err);
                }
            );
        }
    });

    app.post('/user/setUserProfile', isLoggedIn, function (req, res) {

        if (!req.body.user) {
            res.status = 404;
            res.json({message: 'You have to provide data for updating you profile!'});
        }else if (req.body.user._id !== req.user._id) {
            res.status = 404;
            res.json({message: 'You can only change you profile!'});
        } else if (!req.body.user.userType) {
            res.status = 404;
            res.json({message: 'You have to provide userType for updating you profile!'});
        } else if (req.body.user.userType === 'ADMIN') {
            adminService.updateAdmin(req.body.user).then(function (err, data) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(data);
                }
            });
        } else if (req.body.user.userType === 'PROFESSOR') {
            professorService.updateProfessor(req.body.user).then(function (err, data) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(data);
                }
            });
        } else if (req.body.user.userType === 'STUDENT') {
            studentService.updateStudent(req.body.user).then(function (err, data) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(data);
                }
            });
        } else {
            res.status = 404;
            res.json({message: 'You have provided wrong userType for updating you profile!'});
        }

    });

    app.post('/user/editUserProfile', adminApproved, function (req, res) {

        if (!req.body.user) {
            res.status = 404;
            res.json({message: 'You have to provide data for updating user profile!'});
        } else if (!req.body.user.userType) {
            res.status = 404;
            res.json({message: 'You have to provide userType for updating user profile!'});
        } else if (req.body.user.userType === 'ADMIN') {
            adminService.updateAdmin(req.body.user).then(function (err, data) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(data);
                }
            });
        } else if (req.body.user.userType === 'PROFESSOR') {
            professorService.updateProfessor(req.body.user).then(function (err, data) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(data);
                }
            });
        } else if (req.body.user.userType === 'STUDENT') {
            studentService.updateStudent(req.body.user).then(function (err, data) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(data);
                }
            });
        } else {
            res.status = 404;
            res.json({message: 'You have provided wrong userType for updating user profile!'});
        }

    });

    app.post('/user/createNewUser', adminApproved, function (req, res, next) {
        if (!req.body.user) {
            res.status = 404;
            res.json({message: 'You have to provide user data for new user!'});
        } else if (!req.body.user.userType) {
            res.status = 404;
            res.json({message: 'You have to provide userType for new user!'});
        } else if (req.body.user.userType === 'ADMIN') {
            res.json(adminService.createAdmin(req.body.user));
        } else if (req.body.user.userType === 'PROFESSOR') {
            res.json(professorService.createProfessor(req.body.user));
        } else if (req.body.user.userType === 'STUDENT') {
            res.json(studentService.createStudent(req.body.user));
        } else {
            res.status = 404;
            res.json({message: 'You have provided wrong userType for new user!'});
        }
    });

    app.post('/user/deactivateUser', adminApproved, function (req, res, next) {
        console.dir(req.body);
        if(!req.body.id){
            res.status = 404;
            res.json({message: 'You have to provide id for deactivating a user!'});
        }else if (!req.body.userType) {
            res.status = 404;
            res.json({message: 'You have to provide userType for deactivating a user!'});
        } else if (req.body.id === req.user._id) {
            res.status = 404;
            res.json({message: 'You cannot disable yourself!'});
        } else if (req.body.userType === 'ADMIN') {
            adminService.deactivateAdmin(req.body.id).then(function (err, data) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(data);
                }
            });
        } else if (req.body.userType === 'PROFESSOR') {
            professorService.deactivateProfessor(req.body.id).then(function (err, data) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(data);
                }
            });
        } else if (req.body.userType === 'STUDENT') {
            studentService.deactivateStudent(req.body.id).then(function (err, data) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(data);
                }
            });
        } else {
            res.status = 404;
            res.json({message: 'You have provided wrong userType deactivating a user!'});
        }

    });

    app.get('/user/getAllStudents', adminAndProfessorApproved, function (req, res) {
        studentService.getAllStudents().then(function (err, data) {
            if (err) {
                res.json(err);
            } else {
                res.json(data);
            }
        });
    });

    app.get('/user/getAllProfessors', adminApproved, function (req, res) {
        professorService.getAllProfessors().then(function (err, data) {
            if (err) {
                res.json(err);
            } else {
                res.json(data);
            }
        });
    });

    app.get('/user/getAllAdmins', adminApproved, function (req, res) {
        adminService.getAllAdmins().then(function (err, data) {
            if (err) {
                console.dir(err);
                res.json(err);
            } else {
                console.dir(data);
                res.json(data);
            }
        });
    });

};