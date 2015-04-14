/**
 * Created by bogdanbegovic on 4/13/15.
 */

module.exports = function (app, passport) {
    'use strict';

    var Admin = require('../models/admin');
    var Professor = require('../models/professor');
    var Student = require('../models/student');
    var bcrypt = require('bcrypt-nodejs');

    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {
        // if user is authenticated in the session, carry on
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.statusCode = 401;
            res.json({poruka: 'hoces kurac'});
        }
    }

    app.get('/user/profile', isLoggedIn, function (req, res) {
        res.json({test: 'moze'});
    });

    app.get('/user/logout', isLoggedIn, function (req, res) {
        req.logout();
    });

    app.post('/user/createNewAdmin', isLoggedIn, function (req, res, next) {
        passport.authenticate('local-createNewAdmin', function (err, user, info) {
            if (err) {
                return res.json(err);
            }
            if (!user) {
                return res.json(info);
            } else {
                res.json(user);
            }
        })(req, res, next);
    });

    app.post('/user/createNewProfessor', isLoggedIn, function (req, res, next) {
        passport.authenticate('local-createNewProfessor', function (err, user, info) {
            if (err) {
                return res.json(err);
            }
            if (!user) {
                return res.json(info);
            } else {
                res.json(user);
            }
        })(req, res, next);
    });

    app.post('/user/createNewStudent', isLoggedIn, function (req, res, next) {
        passport.authenticate('local-createNewStudent', function (err, user, info) {
            if (err) {
                return res.json(err);
            }
            if (!user) {
                return res.json(info);
            } else {
                res.json(user);
            }
        })(req, res, next);
    });

    app.post('/user/auth', function (req, res, next) {
        console.log('/user/auth');
        console.dir(req.body);
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