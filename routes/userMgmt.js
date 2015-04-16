/**
 * Created by bogdanbegovic on 4/13/15.
 */

module.exports = function (app, passport) {
    'use strict';

    var Admin = require('../models/admin');
    var Professor = require('../models/professor');
    var Student = require('../models/student');

    var adminService = require('../services/adminService');
    var professorService = require('../services/professorService');
    var studentService = require('../services/studentService');
    var mailService = require('../services/mailService');

    var bcrypt = require('bcrypt-nodejs');
    var generatePassword = require('password-generator');

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

    app.get('/user/profile', isLoggedIn, function (req, res) {
        res.json({test: 'moze'});
    });

    app.get('/sendMail', function (req, res) {
        res.json(mailService.sendEmail());
    });

    app.post('/user/setUserProfile', isLoggedIn, function (req, res) {
        console.dir(req.body);
        var dUser = null;

        var updateAdmin = adminService.updateAdmin(req.body.user);

        var updateProfessor = professorService.updateProfessor(req.body.user);

        var updateStudent = studentService.updateStudent(req.body.user);

        var update = updateAdmin.then(function (err, doc) {
            console.log('updateAdmin');
            console.dir(err);
            console.dir(doc);
        }).chain(updateProfessor).then(function (err, doc) {
            console.log('updateProfessor');
            console.dir(err);
            console.dir(doc);
        }).chain(updateStudent).then(function (err, doc) {
            console.log('updateStudent');
            console.dir(err);
            console.dir(doc);
        })
            .onResolve(function () {
                console.log('uspesno');
                //done(null, dUser);
            })
            .onReject(function (err) {
                console.error(err);
                //done(err, dUser);
            });
    });

    app.get('/user/getAllStudents', adminAndProfessorApproved, function (req, res) {
        studentService.getAllStudents().then(function(err, data){
            if (err) {
                return res.json(err);
            } else {
                res.json(data);
            }
        });
    });

    app.get('/user/getAllProfessors', adminApproved, function (req, res) {
        professorService.getAllProfessors().then(function(err, data){
            if (err) {
                return res.json(err);
            } else {
                res.json(data);
            }
        });
    });

    app.get('/user/getAllAdmins', adminApproved, function (req, res) {
        adminService.getAllAdmins().then(function(err, data){
            if (err) {
                return res.json(err);
            } else {
                res.json(data);
            }
        });
    });

    app.post('/user/createNewAdmin', adminApproved, function (req, res, next) {
        res.json(adminService.createAdmin(req.body.user));
    });

    app.post('/user/createNewProfessor', adminApproved, function (req, res, next) {
        res.json(professorService.createProfessor(req.body.user));
    });

    app.post('/user/createNewStudent', adminApproved, function (req, res, next) {
        res.json(studentService.createStudent(req.body.user));
    });

    app.get('/user/logout', isLoggedIn, function (req, res) {
        req.logout();
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
};