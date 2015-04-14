/**
 * Created by bogdanbegovic on 4/13/15.
 */

module.exports = function (app, passport) {
    'use strict';

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

    app.get('/', function (req, res) {
        res.json({test: 'test'});
    });

    app.get('/signup', function (req, res) {
        res.json({test: 'signup'});
    });

    app.get('/profile', isLoggedIn, function (req, res) {
        res.json({test: 'moze'});
    });

    app.get('/logout', function (req, res) {
        req.logout();
    });

    app.post('/signup', function (req, res, next) {
        passport.authenticate('local-signup', function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.json(info);
            }else{
                res.json(user);
            }
        })(req, res, next);
    });

    app.post('/login', function (req, res, next) {
        console.log(req.body);
        passport.authenticate('local-login', function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.json(info);
            }else{
                res.json(user);
            }
        })(req, res, next);
    });
};

